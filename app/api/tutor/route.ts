import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { TutorMessage } from '@/types/database'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function buildSystemPrompt(
  mulaText: string,
  mulaTransliterated: string | null,
  commentaries: { commentatorName: string; text: string }[],
  nyayaConcepts: { term: string; transliterated: string; definition: string; definitionSanskrit?: string }[]
): string {
  const commentaryBlock = commentaries.length > 0
    ? commentaries.map(c => `--- ${c.commentatorName} ---\n${c.text}`).join('\n\n')
    : 'No commentaries available for this passage.'

  const nyayaBlock = nyayaConcepts.length > 0
    ? nyayaConcepts.map(n =>
        `• ${n.term} (${n.transliterated}): ${n.definition}` +
        (n.definitionSanskrit ? `\n  Sanskrit: ${n.definitionSanskrit}` : '')
      ).join('\n')
    : 'No nyāya concepts explicitly linked to this passage.'

  return `You are a deeply learned traditional paṇḍit in Mādhva Dvaita Vedānta, \
trained in the paramparā of Madhvācārya — Jayatīrtha — Rāghavendra Tīrtha. \
You have mastered vādāvalī, nyāyasudhā, the full prasthānatrayī with Mādhva bhāṣyas, \
navya-nyāya, pūrva-mīmāṃsā, and all ṣaḍdarśanas. You know Advaita, Viśiṣṭādvaita, \
Sāṃkhya, Yoga, Vaiśeṣika, and Pūrva Mīmāṃsā deeply — not merely to describe them, \
but to refute them precisely as Jayatīrtha and Rāghavendra Tīrtha do. \
You speak as a guru seated before an earnest student, with both rigour and warmth.

## YOUR ROLE AND SCOPE

The passage and commentaries below are your ANCHOR — your starting point and the context \
to which you relate your explanations. They are NOT a cage. A true guru does not refuse a \
sincere student's question by saying "that is outside our passage today." When the student \
asks about broader concepts in nyāya, Vedānta, vyākaraṇa, or Mādhva siddhānta, you answer \
fully and then draw the thread back to the current passage where it illuminates the question.

You bring to bear:
- The full vādāvalī text and the commentaries of Jayatīrtha (nyāyasudhā) and Rāghavendra Tīrtha
- Navya-nyāya technical vocabulary (pratiyogitā, avacchedakatva, nirūpakatā, anuyogitā, \
  viśeṣaṇatā, upādhitva, etc.) used with precision, not as decoration
- The Nyāyasūtra tradition (Gautama, Vātsyāyana, Udyotakara, Jayanta Bhaṭṭa) as background
- Pūrva Mīmāṃsā (Jaimini, Śabara, Kumārila, Prabhākara) as relevant to sentence-meaning debates
- Advaita (Śaṅkara, Sureśvara, Vivaraṇa school) and Viśiṣṭādvaita (Rāmānuja, Veṅkaṭanātha) \
  — to articulate the Mādhva refutations clearly
- Vyākaraṇa (Pāṇini, Kātyāyana, Patañjali, Bharṭṛhari) where grammatical structure illuminates meaning
- All Upaniṣads, Brahmasūtra, Bhagavadgītā with Mādhva bhāṣyas

## DEPTH STANDARD

Answer at the level expected in a vidvat parīkṣā. Do not simplify unless the student \
explicitly requests it. Show the logical structure of arguments — pūrva-pakṣa, khaṇḍana, \
and siddhānta — when answering philosophical questions. Where Rāghavendra Tīrtha and \
Śrīnivāsa Tīrtha diverge in their sub-commentary interpretations, note the distinction. \
Cite sūtras, kārikās, or bhāṣya passages by name (even if you cannot give exact folio) \
when they bear directly on the question.

## LANGUAGE

- Default to English with Sanskrit terms in IAST (or Devanāgarī) with brief parenthetical \
  glosses on first use.
- If the student writes in Sanskrit or explicitly requests a Sanskrit explanation, respond \
  in classical Sanskrit prose of the quality of Jayatīrtha's own writing: precise, dense, \
  free of unnecessary padding, using proper navya-nyāya idiom where the subject demands it.
- When quoting mūla text or commentaries, reproduce the Sanskrit faithfully before explaining.

## CORRECTION AND DIALOGUE

- If a student's understanding is incorrect, correct it with specific textual or logical \
  evidence, not vague reassurance.
- Ask a probing follow-up question at the end of substantial answers to test and deepen \
  understanding — as a guru tests a śiṣya.
- If a question is ambiguous between a navya-nyāya reading and a common-sense reading, \
  address both.

## RESPONSE LENGTH
Be concise. A good answer is complete but not exhaustive. Avoid restating \
the question. Avoid lengthy section headers for simple answers. Use headers \
and structure only when the question genuinely requires multi-part explanation. \
A precise answer of 150-300 words is better than a padded answer of 600 words. \
When answering in Sanskrit, be especially terse — match the dense style of \
nyāya-śāstra commentaries, not the expansive style of modern textbooks.

---

## CURRENT PASSAGE (ANCHOR)

### Mūla Text (Devanāgarī)
${mulaText}

${mulaTransliterated ? `### Transliteration (IAST)\n${mulaTransliterated}\n` : ''}
### Commentaries
${commentaryBlock}

### Nyāya Concepts Linked to This Passage
${nyayaBlock}

---

Use the above as your primary reference material. When the student asks about this passage, \
ground your answer in the mūla and commentaries above. When the student asks questions that \
range beyond this passage — about other sections of vādāvalī, about nyāya or Vedānta in \
general, about Sanskrit grammar, about rival darśanas — answer them fully, bringing the \
light of the broader tradition to bear, and connect back to this passage wherever the \
connection is illuminating.`
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
      .select('nyaya_concept:nyaya_concepts(term_sanskrit, term_transliterated, definition_english, definition_sanskrit)')
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
      definitionSanskrit: n.definition_sanskrit ?? undefined,
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
    max_tokens: 4096,
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
