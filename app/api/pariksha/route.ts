import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function buildExaminerPrompt(
  scope: 'full' | 'passage',
  textTitle: string,
  passageContext?: { mula: string; transliterated?: string | null; commentaries: string }
): string {
  const scopeDescription = scope === 'passage'
    ? `a specific passage from ${textTitle}`
    : `the full text of ${textTitle}`

  const contextBlock = passageContext
    ? `\n## PASSAGE\n${passageContext.mula}\n${passageContext.transliterated ? `\nTransliteration: ${passageContext.transliterated}` : ''}\n\n## COMMENTARIES\n${passageContext.commentaries}`
    : ''

  return `You are a traditional paṇḍit conducting a vidvat parīkṣā (scholarly examination) on ${scopeDescription}.
Your role is to rigorously test the student's understanding through oral examination, as in a traditional viva.
${contextBlock}

## EXAMINATION RULES
1. Ask ONE question at a time. Do NOT ask multiple questions in a single turn.
2. Wait for the student's answer before asking the next question.
3. Phrase questions as a traditional paṇḍit would: "katham...", "kiṃ matam...", "kena kāraṇena...", etc. You may write the question in Sanskrit with an English translation.
4. Questions must probe: (a) the logical argument chain in the text, (b) specific nyāya terminology, (c) Rāghavendra Tīrtha's interpretations, (d) philosophical implications for Dvaita Vedānta.
5. After each student answer, provide brief evaluation in this EXACT format:

SCORE_PHILOSOPHY: [0-10]
SCORE_SANSKRIT: [0-10 if they answered in Sanskrit, else null]
FEEDBACK: [2-3 sentences: what was correct, what was incomplete or incorrect, with textual references]

आदर्शोत्तरम् (Ideal Answer):
[The complete, precise answer a top vidvat parīkṣā candidate would give, written in classical Sanskrit Devanāgarī script]

English:
[Clear English translation and explanation of the ideal answer above]

Then ask the next question.

6. After 5 questions, end the examination with a comprehensive summary in this EXACT format:

EXAMINATION_COMPLETE
FINAL_SCORE_PHILOSOPHY: [average 0-10]
FINAL_SCORE_SANSKRIT: [average if applicable, else null]
OVERALL_FEEDBACK: [paragraph summarizing philosophical understanding]
STRENGTHS: [bullet list]
AREAS_FOR_IMPROVEMENT: [bullet list]

7. Begin the examination now by welcoming the student briefly and asking the first question.`
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { textId, passageId, messages, sessionId } = await req.json() as {
    textId: string
    passageId?: string
    messages: { role: 'user' | 'assistant'; content: string }[]
    sessionId?: string
  }

  // Fetch text
  const { data: text } = await supabase
    .from('texts').select('title, title_transliterated').eq('id', textId).single()

  if (!text) return NextResponse.json({ error: 'Text not found' }, { status: 404 })

  let passageContext: { mula: string; transliterated?: string | null; commentaries: string } | undefined

  if (passageId) {
    const [{ data: passage }, { data: commentaries }] = await Promise.all([
      supabase.from('passages').select('mula_text, mula_transliterated').eq('id', passageId).single(),
      supabase.from('commentaries')
        .select('commentary_text, commentator:commentators(name)')
        .eq('passage_id', passageId).eq('is_approved', true),
    ])

    if (passage) {
      const commentaryBlock = (commentaries ?? [])
        .filter(c => c.commentary_text)
        .map(c => `${(c.commentator as any)?.name}: ${c.commentary_text}`)
        .join('\n\n')

      passageContext = {
        mula: passage.mula_text,
        transliterated: passage.mula_transliterated,
        commentaries: commentaryBlock || 'No commentaries available.',
      }
    }
  }

  const systemPrompt = buildExaminerPrompt(
    passageId ? 'passage' : 'full',
    text.title_transliterated,
    passageContext
  )

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.length > 0 ? messages : [{ role: 'user', content: 'Begin the examination.' }],
  })

  const encoder = new TextEncoder()
  let fullResponse = ''

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const text = chunk.delta.text
            fullResponse += text
            controller.enqueue(encoder.encode(text))
          }
        }
      } finally {
        controller.close()

        // Parse scores from response for session saving
        const philosophyMatch = fullResponse.match(/FINAL_SCORE_PHILOSOPHY:\s*([\d.]+)/)
        const sanskritMatch = fullResponse.match(/FINAL_SCORE_SANSKRIT:\s*([\d.]+|null)/)
        const finalFeedbackMatch = fullResponse.match(/OVERALL_FEEDBACK:\s*([\s\S]+?)(?=STRENGTHS:|$)/)

        const isComplete = fullResponse.includes('EXAMINATION_COMPLETE')

        if (sessionId) {
          const updateData: Record<string, unknown> = {}
          if (isComplete) {
            if (philosophyMatch) updateData.score_philosophy = parseFloat(philosophyMatch[1])
            if (sanskritMatch && sanskritMatch[1] !== 'null') updateData.score_sanskrit = parseFloat(sanskritMatch[1])
            if (finalFeedbackMatch) updateData.ai_feedback_text = finalFeedbackMatch[1].trim()
          }
          supabase.from('pariksha_sessions')
            .update(updateData)
            .eq('id', sessionId)
            .then(() => null)
        } else {
          supabase.from('pariksha_sessions')
            .insert({ user_id: user.id, text_id: textId, passage_id: passageId ?? null,
              questions_asked: [], answers_given: [] })
            .then(() => null)
        }
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
