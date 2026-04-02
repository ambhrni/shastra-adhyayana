import * as fs from 'fs'
import * as path from 'path'

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const raw of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    if (!process.env[key]) process.env[key] = line.slice(eqIdx + 1).trim()
  }
}
loadEnvLocal()

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) { console.error('No GEMINI_API_KEY'); process.exit(1) }

async function main() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
  )
  const data = await res.json() as any
  if (data.error) { console.error('API error:', data.error); process.exit(1) }

  console.log('Models supporting embedContent:\n')
  for (const model of data.models ?? []) {
    const methods = model.supportedGenerationMethods ?? []
    if (methods.includes('embedContent')) {
      console.log(`  ${model.name}`)
    }
  }
}

main().catch(console.error)
