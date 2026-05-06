import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic()

const TONE_DESCRIPTIONS: Record<string, string> = {
  professional: 'authoritative, credible, and industry-focused',
  casual: 'conversational, friendly, and approachable',
  inspiring: 'motivational, uplifting, and emotionally resonant',
  educational: 'informative, clear, and value-driven with practical takeaways',
  controversial: 'bold, counter-intuitive, and debate-sparking',
}

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  story: `Write a first-person micro-story LinkedIn post.
1. Hook: one punchy line that drops the reader into the scene
2. Conflict: the challenge or problem you faced (2-3 lines)
3. Turning point: the moment everything changed (2-3 lines)
4. Lesson: the universal takeaway that applies to the reader (2-3 lines)
5. Close with a question that invites the reader to share their own experience
Keep it tight, personal, and emotionally resonant.`,

  listicle: `Write a numbered list LinkedIn post.
1. Bold hook line that promises specific, countable value
2. 5-7 numbered items — each a sharp insight or tip (1-2 sentences each)
3. A brief "bottom line" or thought-provoking question at the end
Make every item stand alone. No fluff — every line earns its place.`,

  framework: `Write a framework-style LinkedIn post that teaches a clear mental model or system.
1. Hook: name the problem this framework solves
2. Introduce the framework with a memorable name or acronym
3. Break it into 3-4 components or steps, each with a 1-line explanation
4. Show a quick real-world example
5. CTA: challenge the reader to apply it today
Make it feel like a mini-lesson the reader can immediately use.`,

  contrarian: `Write a contrarian LinkedIn post that challenges a widely-held belief.
1. Open by stating the conventional wisdom (set it up before knocking it down)
2. Drop the contrarian take — bold, direct, no hedging
3. Back it up with 2-3 sharp reasons or evidence points
4. Acknowledge the nuance (you're not saying the consensus is always wrong)
5. Close with a question that makes the reader question their own assumptions
Be provocative but grounded — not edgy for its own sake.`,

  data_insight: `Write a data-driven insight LinkedIn post.
1. Hook: lead with a surprising stat or data point (label it as illustrative if not citing a real source)
2. Unpack what the data actually means (2-3 lines)
3. Surface a counterintuitive insight most people miss
4. Practical implication: what should the reader DO differently based on this?
5. Close with a question asking readers to share their own experience or data
Make it feel like insider knowledge, not a press release.`,

  quick_win: `Write a "quick win" LinkedIn post that delivers immediate actionable value.
1. Hook: one line that promises a specific, fast result
2. The single most valuable tip or action (2-3 lines)
3. A micro-breakdown of 3-4 bullet points or numbered steps
4. The result the reader can expect
5. Close with: "Try this today and tell me what happens"
Keep total length under 800 characters. Short. Sharp. Implementable in minutes.`,
}

function buildPrompt(topic: string, tone: string, format: string, audience: string): string {
  const toneDesc = TONE_DESCRIPTIONS[tone] ?? tone
  const formatInstructions = FORMAT_INSTRUCTIONS[format] ?? FORMAT_INSTRUCTIONS.listicle

  return `You are an expert LinkedIn content strategist who has helped hundreds of professionals build massive followings. Generate a LinkedIn post that will stop the scroll and drive real engagement.

**Topic/Idea:** ${topic}
**Tone:** ${tone} — ${toneDesc}
**Target Audience:** ${audience || 'professionals on LinkedIn'}

**Format Instructions:**
${formatInstructions}

**Non-negotiable LinkedIn rules:**
- The very first line is the hook — it's all people see before clicking "see more". Make it impossible to scroll past.
- Short paragraphs only (1-2 sentences max). Use line breaks liberally.
- 2-4 emojis max, placed strategically — never randomly sprinkled
- End with either a direct question (drives comments) or a bold CTA
- Write like a human, not a marketer

Output ONLY the post text — no preamble, no "Here's a post:", no explanations. Ready to copy-paste.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, tone, format, audience } = body

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return Response.json({ error: 'Topic is required' }, { status: 400 })
    }

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: buildPrompt(
          topic.trim(),
          tone || 'professional',
          format || 'listicle',
          (audience || '').trim(),
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
