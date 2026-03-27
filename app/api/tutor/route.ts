import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { TutorMessage } from '@/types/database'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function buildSystemPrompt(
  mulaText: string,
  mulaTransliterated: string | null,
  commentaries: { commentatorName: string; text: string }[],
  nyayaConcepts: { term: string; transliterated: string; definition: string }[]
): string {
  const commentaryBlock = commentaries.length > 0
    ? commentaries.map(c => `--- ${c.commentatorName} ---\n${c.text}`).join('\n\n')
    : 'No commentaries available for this passage.'

  const nyayaBlock = nyayaConcepts.length > 0
    ? nyayaConcepts.map(n => `• ${n.term} (${n.transliterated}): ${n.definition}`).join('\n')
    : 'No nyāya concepts explicitly linked to this passage.'

  return `You are Vedāntācārya, a traditional scholar of Dvaita Vedānta in the paramparā of Madhvācārya, \
deeply versed in the vādāvalī of Jayatīrtha and its commentaries by Rāghavendra Tīrtha and Śrīnivāsa Tīrtha. \
You are helping a student understand the following passage.

## MŪLA TEXT (Sanskrit Devanāgarī)
${mulaText}

${mulaTransliterated ? `## TRANSLITERATION (IAST)\n${mulaTransliterated}\n` : ''}
## COMMENTARIES
${commentaryBlock}

## NYĀYA CONCEPTS IN THIS PASSAGE
${nyayaBlock}

## INSTRUCTIONS
1. Respond in English by default. If the student writes in Sanskrit, respond in Sanskrit.
2. Cite the mūla text and the commentaries when giving explanations. Use IAST transliteration alongside Devanāgarī.
3. Explain nyāya-śāstra concepts without assuming prior knowledge — define every technical term clearly the first time you use it.
4. Be rigorous and accurate. Where Rāghavendra Tīrtha and Śrīnivāsa Tīrtha differ in interpretation, distinguish them explicitly.
5. Act as a patient teacher. Ask the student guiding questions when appropriate to test understanding.
6. If a student's understanding seems incorrect, gently correct it with specific textual evidence.
7. Stay focused on this passage and its philosophical context. Do not speculate beyond the text.`
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { passageId, messages, sessionId } = await req.json() as {
    passageId: string
    messages: TutorMessage[]
    sessionId?: string
  }

  // Fetch passage context
  const [{ data: passage }, { data: commentaries }, { data: nyayaLinks }] = await Promise.all([
    supabase.from('passages').select('mula_text, mula_transliterated').eq('id', passageId).single(),
    supabase.from('commentaries')
      .select('commentary_text, commentator:commentators(name)')
      .eq('passage_id', passageId)
      .eq('is_approved', true),
    supabase.from('passage_nyaya_links')
      .select('nyaya_concept:nyaya_concepts(term_sanskrit, term_transliterated, definition_english)')
      .eq('passage_id', passageId),
  ])

  if (!passage) return NextResponse.json({ error: 'Passage not found' }, { status: 404 })

  const commentaryContext = (commentaries ?? [])
    .filter(c => c.commentary_text)
    .map(c => ({
      commentatorName: (c.commentator as any)?.name ?? 'Unknown',
      text: c.commentary_text!,
    }))

  const nyayaContext = (nyayaLinks ?? [])
    .map(l => l.nyaya_concept as any)
    .filter(Boolean)
    .map((n: any) => ({
      term: n.term_sanskrit,
      transliterated: n.term_transliterated,
      definition: n.definition_english,
    }))

  const systemPrompt = buildSystemPrompt(
    passage.mula_text,
    passage.mula_transliterated,
    commentaryContext,
    nyayaContext
  )

  // Build conversation for Claude
  const claudeMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  // Stream response
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: claudeMessages,
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

        // Save session to database (fire-and-forget)
        const assistantMessage: TutorMessage = {
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date().toISOString(),
        }
        const allMessages: TutorMessage[] = [...messages, assistantMessage]

        if (sessionId) {
          supabase.from('tutor_sessions')
            .update({ messages: allMessages })
            .eq('id', sessionId)
            .then(() => null)
        } else {
          supabase.from('tutor_sessions')
            .insert({
              user_id: user.id,
              passage_id: passageId,
              messages: allMessages,
            })
            .then(() => null)
        }
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
