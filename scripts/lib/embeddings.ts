/**
 * embeddings.ts — shared Gemini embedding utility for all RAG scripts.
 * Model: text-embedding-004 (768 dimensions, GA)
 * taskType: RETRIEVAL_DOCUMENT for ingestion, RETRIEVAL_QUERY for search queries
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

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
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_DOCUMENT'
): Promise<number[]> {
  const model = getClient().getGenerativeModel({ model: 'text-embedding-004' })
  const result = await model.embedContent({
    content: { parts: [{ text }], role: 'user' },
    taskType,
  })
  return result.embedding.values
}

export async function embedBatch(
  texts: string[],
  delayMs = 200,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_DOCUMENT'
): Promise<number[][]> {
  const embeddings: number[][] = []
  for (const text of texts) {
    embeddings.push(await embedText(text, taskType))
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs))
  }
  return embeddings
}
