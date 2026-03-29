import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Load at module level — one read per cold start
const fontBuf = fs.readFileSync(
  path.join(
    process.cwd(),
    'node_modules/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-400-normal.woff'
  )
)
// Correct Buffer → ArrayBuffer conversion (Buffer.buffer is the pool, not the slice)
const devanagariFont: ArrayBuffer = fontBuf.buffer.slice(
  fontBuf.byteOffset,
  fontBuf.byteOffset + fontBuf.byteLength
) as ArrayBuffer

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#1A0500',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '60px',
        }}
      >
        {/* ॥ श्रीः ॥ */}
        <div
          style={{
            color: '#FF8C00',
            fontSize: '36px',
            fontFamily: 'NotoDevanagari',
            letterSpacing: '6px',
          }}
        >
          ॥ श्रीः ॥
        </div>

        {/* Tattvasudhā */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: '80px',
            fontWeight: 'bold',
            fontFamily: 'serif',
            letterSpacing: '-1px',
          }}
        >
          Tattvasudhā
        </div>

        {/* तत्त्वसुधा */}
        <div
          style={{
            color: '#FF6B00',
            fontSize: '52px',
            fontFamily: 'NotoDevanagari',
          }}
        >
          तत्त्वसुधा
        </div>

        {/* Divider */}
        <div
          style={{
            width: '400px',
            height: '1px',
            backgroundColor: '#7A3000',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            color: '#F0DFC0',
            fontSize: '22px',
            fontFamily: 'serif',
            textAlign: 'center',
            lineHeight: '1.6',
          }}
        >
          A jñānayajña — Madhva tattvavāda aligned Vēda Vēdānta śāstra study
        </div>

        {/* URL */}
        <div
          style={{
            color: '#FF8C00',
            fontSize: '18px',
            fontFamily: 'serif',
            letterSpacing: '3px',
          }}
        >
          tattvasudha.org
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'NotoDevanagari', data: devanagariFont, style: 'normal' as const }],
    }
  )
}
