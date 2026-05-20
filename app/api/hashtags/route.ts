import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic()

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const planResult = await supabase.from('user_plans').select('plan').eq('user_id', userId).maybeSingle()
  if (planResult.data?.plan !== 'pro') {
    return Response.json({ error: 'Pro feature' }, { status: 403 })
  }

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
        content: `Given this LinkedIn post, return exactly 3 relevant hashtags as a JSON array of strings. Do NOT include the # symbol. Return plain text hashtag words only — no markdown, no asterisks, no formatting. Only return the JSON array, nothing else.\n\nPost:\n${text.slice(0, 1200)}`,
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
