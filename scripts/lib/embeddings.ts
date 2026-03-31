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
  taskType: TaskType = TaskType.RETRIEVAL_DOCUMENT
): Promise<number[]> {
  const model = getClient().getGenerativeModel({ model: 'models/gemini-embedding-2-preview' }, { apiVersion: 'v1beta' })
  const result = await model.embedContent({
    content: { parts: [{ text }], role: 'user' },
    taskType,
  })
  return result.embedding.values
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
