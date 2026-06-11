import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, FREE_DAILY_LIMIT } from '@/lib/supabase'

const anthropic = new Anthropic()

function buildPrompt(sourceMaterial: string): string {
  return `You are a GovCon content strategist. Read the federal procurement notice below and suggest 5 specific LinkedIn post topic angles a GovCon founder, BD lead, or consultant could write about.

Rules:
- Each topic must be grounded in the specific details of this notice (agency, scope, set-aside, NAICS, timeline, dollar value)
- Each topic must be a distinct angle — no variations of the same idea
- Each topic must be under 100 characters
- Write as a topic or angle for a post, not a headline
- Return ONLY a valid JSON array of 5 strings — no preamble, no explanation, no markdown

Source material:
---
${sourceMaterial}
---`
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read-only plan + usage check — no increment
    const { data: planData } = await supabase
      .from('user_plans')
      .select('plan')
      .eq('user_id', userId)
      .maybeSingle()

    const isPro = planData?.plan === 'pro'

    if (!isPro) {
      const today = new Date().toISOString().slice(0, 10)
      const { data: usageData } = await supabase
        .from('daily_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle()

      const currentCount = usageData?.count ?? 0
      if (currentCount >= FREE_DAILY_LIMIT) {
        return Response.json(
          { error: 'Daily limit reached. Upgrade to Pro for unlimited suggestions.' },
          { status: 429 }
        )
      }
      // No upsert here — suggest-topics never increments daily_usage
    }

    const body = await request.json()
    const { sourceMaterial } = body

    if (!sourceMaterial || typeof sourceMaterial !== 'string' || sourceMaterial.trim().length < 50) {
      return Response.json({ error: 'sourceMaterial is required (min 50 chars)' }, { status: 400 })
    }

    const safeSource = sourceMaterial.trim().slice(0, 3000)

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: buildPrompt(safeSource) }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    // Strip markdown fences (e.g. ```json ... ```) that the model sometimes adds
    const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    let topics: string[] | null = null
    try {
      const parsed = JSON.parse(stripped)
      if (Array.isArray(parsed)) {
        topics = parsed.filter((t): t is string => typeof t === 'string').slice(0, 5)
      }
    } catch {
      // fall through to regex fallback
    }

    if (!topics) {
      // Fallback: extract the first [...] array literal from the raw text
      const match = /\[[\s\S]*\]/.exec(raw)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          if (Array.isArray(parsed)) {
            topics = parsed.filter((t): t is string => typeof t === 'string').slice(0, 5)
          }
        } catch {
          // fall through
        }
      }
    }

    if (!topics) {
      return Response.json({ error: 'Failed to parse topic suggestions' }, { status: 500 })
    }

    return Response.json({ topics })
  } catch (err) {
    console.error('Suggest-topics error:', err)
    return Response.json({ error: 'Failed to suggest topics' }, { status: 500 })
  }
}
