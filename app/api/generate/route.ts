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
  standard: `Write a standard LinkedIn post: hook → body with key insights → call to action or closing thought.`,
  hook_value: `Start with a single bold statement or question as the hook (1 line). Then deliver 3-5 punchy value points. Close with a CTA.`,
  story: `Write a first-person micro-story: set the scene, describe the conflict/challenge, reveal the turning point, share the lesson. Keep it tight.`,
  list: `Write a numbered list post. Start with a bold hook line. Then list 5-7 insight/tips, each 1-2 sentences. End with a brief summary or question.`,
  poll: `Suggest an engaging LinkedIn poll. Write a provocative 1-line poll question, then provide 4 compelling answer options. Add 2-3 sentences of context above the poll.`,
}

function buildPrompt(topic: string, tone: string, format: string, audience: string): string {
  const toneDesc = TONE_DESCRIPTIONS[tone] ?? tone
  const formatInstructions = FORMAT_INSTRUCTIONS[format] ?? FORMAT_INSTRUCTIONS.standard

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
- Stay under 1,300 characters for maximum algorithmic reach

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
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      messages: [{
        role: 'user',
        content: buildPrompt(
          topic.trim(),
          tone || 'professional',
          format || 'standard',
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
