/**
 * Temporary diagnostic script — print first 5 data rows of the bhēdōjjīvanam Excel file.
 * Delete after use.
 */
import * as XLSX from 'xlsx'

const FILE = 'C:/Users/naray/OneDrive/Documents/bhEdojjIvanam/bhEdOjjIvanam for Tattvasudha (1).xlsx'

const wb    = XLSX.readFile(FILE, { codepage: 65001 })
const sheet = wb.Sheets[wb.SheetNames[0]]
const rows  = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '', raw: false })

console.log('Sheet names :', wb.SheetNames)
console.log('Total rows  :', rows.length)
console.log()
console.log('--- Row 1 (header) ---')
console.log(JSON.stringify(rows[0], null, 2))
console.log()
console.log('--- Rows 2–6 (first 5 data rows) ---')
for (let i = 1; i <= 5 && i < rows.length; i++) {
  console.log(`Row ${i + 1}: ${JSON.stringify(rows[i])}`)
}
