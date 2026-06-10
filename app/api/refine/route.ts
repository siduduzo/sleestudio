import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, FREE_DAILY_LIMIT } from '@/lib/supabase'

const anthropic = new Anthropic()

const VALID_FORMATS = [
  'founder_insight', 'agency_buying_signal', 'opportunity_breakdown',
  'mistake_to_avoid', 'teaming_partner_angle', 'small_business_office_outreach', 'carousel_brief',
] as const

function buildRefinePrompt(
  format: string,
  tone: string,
  existingContent: string,
  sourceMaterial: string,
  govconMode: boolean,
): string {
  const formatLabel = format.replace(/_/g, ' ')

  const sourceContext = sourceMaterial
    ? `\n**Source material the original post was based on:**\n---\n${sourceMaterial}\n---\n`
    : ''

  const govconNote = govconMode
    ? `\n**GovCon Data Mode is active:** Do not add any new facts, figures, agencies, NAICS codes, or statistics not present in the source material above. Write [source needed] for anything missing — never invent it.\n`
    : ''

  return `You are a GovCon content editor. Refine the LinkedIn post below — improve it without generating a new post from scratch.

**Format:** ${formatLabel}
**Tone:** ${tone}
${sourceContext}${govconNote}
**Post to refine:**
---
${existingContent}
---

**Refinement instructions:**
- Remove AI-sounding phrases: "In today's landscape", "navigating the complexities", "leveraging", "game-changing", "dive deep", "it's more important than ever", "unlock", "robust", "seamlessly"
- Keep every real fact, agency name, NAICS code, contract vehicle, dollar amount, and deadline exactly as written — do not invent or remove data
- Make the voice sound like a real GovCon founder, BD lead, or consultant — not a content marketer
- If the opening line is generic or templated, rewrite just that line to something specific and arresting
- Vary the rhythm — if the post is entirely short punchy lines, add one slightly longer sentence; if it is dense, break it up
- Remove invented personal stories or case studies if they feel fabricated; replace with a grounded observation
- Make the CTA specific and human ("Are you tracking this solicitation?" not "What do you think?")
- Preserve the ${formatLabel} format structure and overall length (within 15%)

Output ONLY the refined post text — no preamble, no "Here's the refined version:", no explanation.`
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
          { error: 'Daily limit reached. Upgrade to Pro for unlimited refinements.' },
          { status: 429 }
        )
      }
      // No upsert here — refine never increments daily_usage
    }

    const body = await request.json()
    const { format, tone, existingContent, sourceMaterial, govconMode } = body

    if (!existingContent || typeof existingContent !== 'string' || existingContent.trim().length < 50) {
      return Response.json({ error: 'existingContent is required (min 50 chars)' }, { status: 400 })
    }

    const safeFormat  = VALID_FORMATS.includes(format) ? format : 'founder_insight'
    const safeTone    = typeof tone === 'string' && tone.trim() ? tone.trim() : 'professional'
    const safeContent = existingContent.trim().slice(0, 3000)
    const safeSource  = typeof sourceMaterial === 'string' ? sourceMaterial.trim().slice(0, 3000) : ''
    const safeGovcon  = govconMode === true

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: buildRefinePrompt(safeFormat, safeTone, safeContent, safeSource, safeGovcon),
      }],
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('Refine error:', err)
    return Response.json({ error: 'Failed to refine content' }, { status: 500 })
  }
}
