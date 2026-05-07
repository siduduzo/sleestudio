import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'text required' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: `Given this LinkedIn post, return exactly 3 relevant hashtags as a JSON array of strings. Do NOT include the # symbol. Only return the JSON array, nothing else.\n\nPost:\n${text.slice(0, 1200)}`,
      }],
    })

    const raw = (message.content[0] as { text: string }).text.trim()
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const hashtags: string[] = JSON.parse(cleaned)
    return Response.json({ hashtags: hashtags.slice(0, 3) })
  } catch {
    return Response.json({ error: 'Failed to generate hashtags' }, { status: 500 })
  }
}
