import { GoogleGenerativeAI, TaskType } from '@google/generative-ai'

export { TaskType }

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
        model: 'models/gemini-embedding-2-preview',
      })
      const result = await model.embedContent({
        content: { parts: [{ text }], role: 'user' },
        taskType,
      })
      return result.embedding.values
    } catch (err: any) {
      const isTransient =
        err?.message?.includes('503') ||
        err?.message?.includes('429') ||
        err?.message?.includes('500')
      if (isTransient && attempt < retries) {
        const delay = attempt * 2000
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      throw err
    }
  }
  throw new Error('embedText: all retries exhausted')
}
