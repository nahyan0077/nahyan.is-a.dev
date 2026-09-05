import nodemailer from 'nodemailer'
import type { IEmailService } from '@api/ports/email.port'

export class NodemailerEmailService implements IEmailService {
  private provider = process.env.EMAIL_PROVIDER ?? 'nodemailer'

  async sendMagicLink(to: string, link: string): Promise<void> {
    if (this.provider === 'resend') {
      await this.sendViaResend(to, link)
    } else {
      await this.sendViaNodemailer(to, link)
    }
  }

  private async sendViaResend(to: string, link: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY not set')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.SMTP_FROM ?? 'Portfolio <noreply@nahyan.dev>',
        to: [to],
        subject: 'Your admin login link',
        html: `<p>Click the link below to log in:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes.</p>`,
      }),
    })

    if (!res.ok) {
      throw new Error(`Resend error: ${res.status} ${await res.text()}`)
    }
  }

  private async sendViaNodemailer(to: string, link: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'localhost',
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: process.env.SMTP_SECURE === 'true',
      ignoreTLS: process.env.SMTP_IGNORE_TLS === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'noreply@portfolio.local',
      to,
      subject: 'Your admin login link',
      text: `Click the link below to log in:\n\n${link}\n\nThis link expires in 15 minutes.`,
      html: `<p>Click the link below to log in:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes.</p>`,
    })
  }
}
