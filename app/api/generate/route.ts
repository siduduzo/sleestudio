import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, FREE_DAILY_LIMIT } from '@/lib/supabase'

const anthropic = new Anthropic()

const VALID_TONES = ['professional', 'casual', 'inspiring', 'educational', 'controversial'] as const
const VALID_FORMATS = ['founder_insight', 'agency_buying_signal', 'opportunity_breakdown', 'mistake_to_avoid', 'teaming_partner_angle', 'small_business_office_outreach', 'carousel_brief'] as const

const TONE_DESCRIPTIONS: Record<string, string> = {
  professional: 'authoritative, credible, and industry-focused',
  casual: 'conversational, friendly, and approachable',
  inspiring: 'motivational, uplifting, and emotionally resonant',
  educational: 'informative, clear, and value-driven with practical takeaways',
  controversial: 'bold, counter-intuitive, and debate-sparking',
}

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  founder_insight: `Write a first-person LinkedIn post from the perspective of a GovCon founder or consultant sharing a specific lesson learned.
1. Hook: one punchy line that drops the reader directly into a moment or realization — no warm-up
2. Context: the situation — what contract, agency challenge, BD moment, or proposal experience this relates to (2-3 lines)
3. The insight: what you learned that most people in GovCon get wrong or overlook (2-3 lines)
4. Why it matters: the practical implication for other small business owners or consultants (2 lines)
5. Close with a question that invites readers to share their own GovCon experience
Keep it specific and credible — no generic business wisdom. This post should only make sense if written by someone with real GovCon experience.`,

  agency_buying_signal: `Write a LinkedIn post that identifies and explains a specific federal agency buying signal.
1. Hook: name the signal and why it matters right now — make it feel like insider intelligence the reader would pay for
2. What the signal is: describe the specific indicator (budget language, RFI, NOFA, industry day announcement, PALT data, spending spike, etc.)
3. What it means: decode the signal — what the agency is likely planning to buy, when, and through what vehicle
4. Who should act: which small business types (SDVOSB, 8(a), HUBZone, WOSB, SB) are best positioned and why
5. What to do next: one concrete action the reader can take this week
Close with a question asking what signals readers are currently tracking.
Use [source needed] for any specific figures or agency names not present in the source material.`,

  opportunity_breakdown: `Write a LinkedIn post that breaks down a specific federal contracting opportunity or procurement.
1. Hook: one line that captures what makes this opportunity significant, unusual, or time-sensitive
2. The basics: agency name, contract type, estimated value, NAICS code, set-aside designation — use [source needed] for anything not in the source
3. What they're really buying: go beyond the SOW title — what problem is the agency actually trying to solve?
4. Key requirements: what a competitive vendor needs — clearances, past performance, certifications, teaming
5. Timeline: due dates, industry day, Q&A deadline, submission date — use [source needed] for missing dates
Close with a question asking who else is tracking this opportunity or has competed in this space.`,

  mistake_to_avoid: `Write a LinkedIn post about a specific, costly mistake in GovCon — BD, proposals, teaming, compliance, past performance, or pricing.
1. Hook: name the mistake directly — bold, specific, no hedging. Lead with the consequence, not the mistake.
2. Why it happens: the common reasoning or assumption that leads people into it (2-3 lines)
3. The real cost: what it actually does to pipeline, win rate, relationships, or compliance standing — be concrete
4. The fix: a specific, actionable alternative — not "do better" but "do this instead," with enough detail to act on
5. Close with a question asking readers whether they've seen this mistake or made it themselves
Be direct and credible. This should feel like hard-won advice, not a blog post. Avoid mistakes that could apply to any industry — keep it GovCon-specific.`,

  teaming_partner_angle: `Write a LinkedIn post about teaming strategy in GovCon — finding partners, structuring agreements, approaching primes or subs, or navigating mentor-protégé and JV structures.
1. Hook: a specific, counterintuitive observation about teaming that stops the scroll — something the reader hasn't heard before
2. The problem: what most small businesses get wrong about teaming at this stage of the BD cycle
3. The real dynamic: how teaming decisions actually get made — relationships, past performance gaps, clearance requirements, capability fit
4. Practical advice: one specific thing the reader can do right now to improve their teaming position or find the right partner
5. Close with a question: who are they looking to team with, or what is their current teaming challenge?
Make it feel like advice from an experienced BD professional, not a legal or FAR interpretation. Focus on the human and strategic side.`,

  small_business_office_outreach: `Write a LinkedIn post about engaging with a federal agency's Small Business Office — OSDBU, PCR, SBLO, or equivalent.
1. Hook: one line that reframes how readers should think about small business offices — most people underuse or misuse them
2. What small business offices actually do: their real role in shaping acquisitions, not just rubber-stamping or box-checking
3. How to engage correctly: what to bring, what to ask, what to avoid — give a concrete meeting structure or opening question
4. When to reach out: the right point in the acquisition cycle where engagement moves the needle vs. wastes everyone's time
5. Close with a question: which agencies have the most responsive small business offices, or what has worked for readers?
Keep it practical. Avoid vague advice like "build relationships" — give the reader something specific enough to act on tomorrow.`,

  carousel_brief: `Write a LinkedIn carousel post formatted as slide-by-slide content (6–8 slides) on a GovCon topic.

Use this exact structure, labeling each slide clearly:

Slide 1: [Hook — one arresting GovCon-specific line that makes people want to swipe. Frame it as an insight, warning, or opportunity. This is all they see in the feed.]

Slide 2: [First key point — bold, single GovCon idea in 1-2 short sentences]

Slide 3: [Second key point]

Slide 4: [Third key point]

Slide 5: [Fourth key point]

Slide 6: [Fifth key point]

Slide 7: [Sixth key point — optional, include if the topic warrants it]

Slide 8: [CTA slide — ask a GovCon-relevant question, invite a share, or give a bold actionable takeaway]

Rules:
- Each slide must be 1-2 sentences max — one idea per slide, no more
- Slide 1 hook must be impossible to scroll past
- Build momentum — each slide should make the reader want the next one
- Make every slide GovCon-specific — no generic business advice
- No markdown, no dashes, just the "Slide N:" label followed by plain text
- Leave a blank line between each slide`,
}

function buildPrompt(
  topic: string,
  tone: string,
  format: string,
  audience: string,
  sourceMaterial: string,
  govconMode: boolean,
): string {
  const toneDesc = TONE_DESCRIPTIONS[tone] ?? tone
  const formatInstructions = FORMAT_INSTRUCTIONS[format] ?? FORMAT_INSTRUCTIONS.founder_insight

  const wasTrimmed = sourceMaterial.length === 3000
  const sourceBlock = sourceMaterial
    ? `\n**SOURCE MATERIAL${wasTrimmed ? ' (excerpt — full text was trimmed to 3,000 characters)' : ''}:**\n---\n${sourceMaterial}\n---\n`
    : ''

  const govconRules = govconMode
    ? `\n**GOVCON DATA MODE — STRICT RULES:**
- Use ONLY facts, figures, agencies, NAICS codes, contract vehicles, deadlines, and dollar amounts present in the SOURCE MATERIAL above
- If a specific data point is not in the source, write [source needed] in brackets — never invent it
- Never fabricate statistics, award amounts, agency names, incumbents, or case studies
- General GovCon domain knowledge is fine for framing; every specific claim must trace to the source\n`
    : ''

  return `You are an expert LinkedIn content strategist who has helped hundreds of professionals build massive followings. Generate a LinkedIn post that will stop the scroll and drive real engagement.

**Topic/Idea:** ${topic}
**Tone:** ${tone} — ${toneDesc}
**Target Audience:** ${audience || 'professionals on LinkedIn'}
${sourceBlock}${govconRules}
**Format Instructions:**
${formatInstructions}

**Output quality rules — NON-NEGOTIABLE:**
- Do NOT open with "Most founders…" or any close variation of that phrase
- Do NOT use invented percentages or statistics — only cite figures present in the source material
- Do NOT invent personal stories, case studies, or client anecdotes
- Do NOT use hype language ("free money", "massive opportunity", "game changer") unless the source explicitly supports it
- Write in plain human language — like a real founder, consultant, or GovCon advisor would speak
- Keep paragraphs to 1-2 sentences max
- Give this post a distinct rhythm and opening line — it must not read like a generic LinkedIn post

**Non-negotiable LinkedIn rules:**
- The very first line is the hook — it's all people see before clicking "see more". Make it impossible to scroll past.
- Short paragraphs only (1-2 sentences max). Use line breaks liberally.
- 2-4 emojis max, placed strategically — never randomly sprinkled
- End with either a direct question (drives comments) or a bold CTA
- Write like a human, not a marketer

**STRICT FORMATTING RULE — NO MARKDOWN WHATSOEVER:**
- No asterisks (* or **) for bold or emphasis
- No ## or # headers
- No bullet dashes (- or –) at the start of lines
- No markdown of any kind
- LinkedIn renders plain text only — use line breaks to create visual structure, nothing else

Output ONLY the post text — no preamble, no "Here's a post:", no explanations. Ready to copy-paste.`
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check plan and enforce daily limit server-side
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
          { error: 'Daily limit reached. Upgrade to Pro for unlimited generations.' },
          { status: 429 }
        )
      }

      const { error: upsertError } = await supabase
        .from('daily_usage')
        .upsert(
          { user_id: userId, date: today, count: currentCount + 1 },
          { onConflict: 'user_id,date' }
        )
      if (upsertError) {
        console.error('[generate] Failed to increment daily_usage:', upsertError.message)
      }
    }

    const body = await request.json()
    const { topic, tone, format, audience, sourceMaterial, govconMode } = body

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return Response.json({ error: 'Topic is required' }, { status: 400 })
    }
    const safeTone     = VALID_TONES.includes(tone)    ? tone   : 'professional'
    const safeFormat   = VALID_FORMATS.includes(format) ? format : 'founder_insight'
    const safeSource   = typeof sourceMaterial === 'string' ? sourceMaterial.trim().slice(0, 3000) : ''
    const safeGovcon   = govconMode === true

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: buildPrompt(
          topic.trim(),
          safeTone,
          safeFormat,
          (audience || '').trim(),
          safeSource,
          safeGovcon,
        ),
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
    console.error('Generate error:', err)
    return Response.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
