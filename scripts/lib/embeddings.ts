/**
 * embeddings.ts — shared Gemini embedding utility for all RAG scripts.
 * Model: gemini-embedding-2-preview (3072 dimensions)
 * taskType: RETRIEVAL_DOCUMENT for ingestion, RETRIEVAL_QUERY for search queries
 */

import { GoogleGenerativeAI, TaskType } from '@google/generative-ai'

let _genAI: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY is not set in environment')
    _genAI = new GoogleGenerativeAI(key)
  }
  return _genAI
}

export async function embedText(
  text: string,
  taskType: TaskType = TaskType.RETRIEVAL_DOCUMENT,
  retries: number = 3
): Promise<number[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = getClient().getGenerativeModel({
        model: 'models/gemini-embedding-2-preview'
      })
      const result = await model.embedContent({
        content: { parts: [{ text }], role: 'user' },
        taskType,
      })
      return result.embedding.values
    } catch (err: any) {
      const isTransient = err?.message?.includes('503') ||
                          err?.message?.includes('429') ||
                          err?.message?.includes('500')
      if (isTransient && attempt < retries) {
        const delay = attempt * 2000  // 2s, 4s backoff
        console.warn(`  ⚠ Attempt ${attempt} failed (${err.message.slice(0, 60)}...) — retrying in ${delay/1000}s`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      throw err
    }
  }
  throw new Error('embedText: all retries exhausted')
}

export async function embedBatch(
  texts: string[],
  delayMs = 200,
  taskType: TaskType = TaskType.RETRIEVAL_DOCUMENT
): Promise<number[][]> {
  const embeddings: number[][] = []
  for (const text of texts) {
    embeddings.push(await embedText(text, taskType))
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs))
  }
  return embeddings
}
