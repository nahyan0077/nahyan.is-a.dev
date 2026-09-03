import type { NextFunction, Request, Response } from 'express'
import { streamText, smoothStream } from 'ai'
import { z } from 'zod'
import type { LlmChatService } from '@api/services/llm-chat.service'
import { llama, LLM_MODEL, OFFLINE_MSG, SYSTEM_PROMPT } from '@api/constants/ai'
import {
  dropConsecutiveDuplicateRolesStartingWithUser,
  keepLastNMessagesStartingWithUser,
  appendConcisenessReminderToLastUserMessage,
} from '@api/utils/ask.utils'

const textPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
})

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(2000).optional(),
        parts: z.array(textPartSchema).optional(),
      }),
    )
    .max(50),
  id: z.string().optional(),
})

export class AskController {
  constructor(private readonly service: LlmChatService) {}

  ask = async (
    req: Request<Record<string, string>, void, unknown>,
    res: Response<void>,
    next: NextFunction,
  ) => {
    try {
      const parse = chatSchema.safeParse(req.body)
      if (!parse.success) {
        console.error('[ask] validation failed:', JSON.stringify(parse.error.flatten(), null, 2))
        res
          .status(400)
          .json({ error: 'Invalid request', details: parse.error.flatten() } as unknown as void)
        return
      }

      const { messages: rawMessages, id: sessionId = crypto.randomUUID() } = parse.data

      const normalized = rawMessages
        .filter(
          (m): m is (typeof rawMessages)[number] & { role: 'user' | 'assistant' } =>
            m.role !== 'system',
        )
        .map((m) => ({
          role: m.role,
          content:
            m.content ??
            (m.parts ?? [])
              .filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join(''),
        }))

      const alternating = dropConsecutiveDuplicateRolesStartingWithUser(normalized)
      const windowed = keepLastNMessagesStartingWithUser(alternating)
      const messagesForModel = appendConcisenessReminderToLastUserMessage(windowed)

      const lastUser = [...messagesForModel].reverse().find((m) => m.role === 'user')
      const prompt = lastUser?.content ?? ''
      const start = Date.now()

      try {
        const result = streamText({
          model: llama(LLM_MODEL),
          system: SYSTEM_PROMPT,
          messages: messagesForModel,
          maxOutputTokens: 150,
          experimental_transform: [smoothStream({ delayInMs: 100, chunking: 'word' })],
          onFinish: ({ text }) => {
            if (prompt) {
              this.service
                .log({
                  sessionId,
                  prompt,
                  responseText: text,
                  durationMs: Date.now() - start,
                  model: LLM_MODEL,
                  ip: req.ip,
                })
                .catch((err) => console.error('[ask] log failed:', err))
            }
          },
        })

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('X-Accel-Buffering', 'no')
        res.setHeader('Cache-Control', 'no-cache')

        for await (const chunk of result.textStream) {
          // Manually smooth the stream since Groq is too fast and
          // experimental_transform doesn't apply to raw textStream
          const tokens = chunk.split(/(\s+)/)
          for (const token of tokens) {
            if (!token) continue
            res.write(token)
            if (token.trim().length > 0) {
              await new Promise((resolve) => setTimeout(resolve, 50))
            }
          }
        }
        res.end()
      } catch (err) {
        console.error('[ask] streamText failed:', err)
        if (prompt) {
          this.service
            .log({
              sessionId,
              prompt,
              responseText: OFFLINE_MSG,
              durationMs: Date.now() - start,
              model: 'none',
              ip: req.ip,
            })
            .catch((logErr) => console.error('[ask] offline log failed:', logErr))
        }
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.write(OFFLINE_MSG)
        res.end()
      }
    } catch (err) {
      next(err)
    }
  }
}
