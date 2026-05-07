import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { text, tone } = await request.json()
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'text required' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `You are a LinkedIn hook specialist. Given this post, write 3 alternative opening lines that would stop the scroll and compel the reader to click "see more". Each hook must be a single punchy sentence — no more. Use plain text only — no asterisks, no bold, no markdown of any kind. Return a JSON array of exactly 3 strings. Only return the JSON array, nothing else.\n\nTone: ${tone || 'professional'}\nPost:\n${text.slice(0, 1200)}`,
      }],
    })

    const raw = (message.content[0] as { text: string }).text.trim()
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const hooks: string[] = JSON.parse(cleaned)
    return Response.json({ hooks: hooks.slice(0, 3) })
  } catch {
    return Response.json({ error: 'Failed to generate hooks' }, { status: 500 })
  }
}
