'use client'

import { useState, useRef } from 'react'
import CornerDecorations from '@/components/atoms/CornerDecorations'
import ChatHeader from '@/components/molecules/ChatHeader'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Input from '@/components/molecules/Input'
import type { Message } from '@/components/molecules/ChatMessage'
import ChatMessage, { TypingMessage } from '@/components/molecules/ChatMessage'
import { useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

const SUGGESTIONS = [
  'what is your stack?',
  'are you available for hire?',
  'tell me about a recent project',
  'how do you approach AI projects?',
]

type ChatEntry = {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
}

const SEED: ChatEntry[] = [
  { id: 'seed', role: 'system', text: 'connected to nahyan.dev — ask anything.' },
]

const MAX_TURNS = 20 // user + assistant pairs

const ChatPanel = () => {
  const [entries, setEntries] = useState<ChatEntry[]>(SEED)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const threadRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Count only user messages to enforce limit
  const userTurns = entries.filter((e) => e.role === 'user').length
  const reachedLimit = userTurns >= MAX_TURNS

  // Auto-scroll on new content
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [entries, streaming])

  const ask = async (question: string) => {
    if (!question.trim() || streaming || reachedLimit) return

    const userEntry: ChatEntry = { id: crypto.randomUUID(), role: 'user', text: question }
    const assistantId = crypto.randomUUID()

    setEntries((prev) => [...prev, userEntry, { id: assistantId, role: 'assistant', text: '' }])
    setStreaming(true)
    setErrorMsg(undefined)

    // Build history for the API (exclude system seed, exclude the empty assistant placeholder)
    const history = entries
      .filter((e) => e.role !== 'system')
      .map((e) => ({ role: e.role, content: e.text }))
    history.push({ role: 'user', content: question })

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`API error ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      // Collect the full streamed response
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
      }

      // Drip the text word-by-word into the UI at a human typing speed
      const words = fullText.split(/(\s+)/)
      let revealed = ''
      const WORD_DELAY_MS = 60 // adjust this to taste — lower = faster

      for (const token of words) {
        if (controller.signal.aborted) break
        revealed += token
        const snapshot = revealed
        setEntries((prev) => prev.map((e) => (e.id === assistantId ? { ...e, text: snapshot } : e)))
        if (token.trim().length > 0) {
          await new Promise((resolve) => setTimeout(resolve, WORD_DELAY_MS))
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setErrorMsg('Something went wrong — try again.')
        // Remove the empty assistant placeholder on error
        setEntries((prev) => prev.filter((e) => e.id !== assistantId))
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  const submit = () => {
    const q = input.trim()
    if (!q) return
    setInput('')
    ask(q)
  }

  // Map our internal entries to what ChatMessage expects
  const roleMap: Record<string, Message['who']> = {
    user: 'user',
    assistant: 'assistant',
    system: 'system',
  }

  return (
    <div
      className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] flex flex-col min-h-[460px] shadow-[var(--shadow-card)]"
      id="chat"
    >
      <CornerDecorations />

      <ChatHeader />

      {/* Message thread */}
      <div
        ref={threadRef}
        className="overflow-y-auto flex flex-col gap-3.5 pt-1 px-1 pb-3 h-[340px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--border-strong)] [&::-webkit-scrollbar-thumb]:rounded-[3px]"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {entries.map((entry) => (
          <ChatMessage
            key={entry.id}
            message={{ who: roleMap[entry.role] ?? 'assistant', body: entry.text }}
          />
        ))}
        {/* Show typing indicator while waiting or while drip hasn't started yet */}
        {streaming && entries[entries.length - 1]?.text === '' && <TypingMessage />}
        {reachedLimit && (
          <div className="text-[13px] font-[family-name:var(--font-mono)] text-[var(--text-faint)] border border-dashed border-[var(--border)] rounded-[8px] px-3 py-2">
            // conversation limit reached — refresh to start over.
          </div>
        )}
        {!reachedLimit && errorMsg && (
          <div className="text-[13px] font-[family-name:var(--font-mono)] text-[var(--text-faint)] border border-dashed border-[var(--border)] rounded-[8px] px-3 py-2">
            // {errorMsg}
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-1.5 pt-2.5 pb-3 border-t border-dashed border-[var(--border)]">
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            as={Chip}
            variant="bare"
            label={s}
            onClick={() => {
              if (!streaming && !reachedLimit) ask(s)
            }}
            disabled={streaming || reachedLimit}
          />
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Input.Text
          variant="chat"
          prompt
          right={
            <Button
              type="submit"
              variant="ghost"
              disabled={streaming || reachedLimit || !input.trim()}
            >
              <span className="hidden sm:inline">send&nbsp;</span>↵
            </Button>
          }
          aria-label="Ask about Nahyan"
          placeholder={reachedLimit ? 'conversation limit reached' : 'ask anything about Nahyan…'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming || reachedLimit}
        />
      </form>
    </div>
  )
}

export default ChatPanel
