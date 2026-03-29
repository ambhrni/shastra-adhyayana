import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

// Read font once at module load time — not inside the request handler
const fontPath = path.join(process.cwd(), 'public/fonts/NotoSansDevanagari-Regular.ttf')
const devanagariFont = fs.existsSync(fontPath) ? fs.readFileSync(fontPath) : null

export async function GET() {
  const fonts = devanagariFont
    ? [{ name: 'Devanagari', data: devanagariFont, style: 'normal' as const }]
    : []

  const devaFamily = fonts.length > 0 ? 'Devanagari' : 'serif'

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
          gap: '16px',
        }}
      >
        {/* ॥ श्रीः ॥ */}
        <div
          style={{
            color: '#FFAA00',
            fontSize: '38px',
            fontFamily: devaFamily,
            letterSpacing: '6px',
          }}
        >
          ॥ श्रीः ॥
        </div>

        {/* Tattvasudhā */}
        <div
          style={{
            color: '#FF8C00',
            fontSize: '72px',
            fontWeight: 'bold',
            fontFamily: 'serif',
          }}
        >
          Tattvasudhā
        </div>

        {/* तत्त्वसुधा */}
        <div
          style={{
            color: '#FF8C00',
            fontSize: '52px',
            fontFamily: devaFamily,
          }}
        >
          तत्त्वसुधा
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#F0DFC0',
            fontSize: '22px',
            fontFamily: 'serif',
            marginTop: '10px',
          }}
        >
          A jñānayajña for Mādhva Dvaita Vedānta śāstra study
        </div>

        {/* URL */}
        <div
          style={{
            color: '#F0DFC0',
            fontSize: '20px',
            fontFamily: 'serif',
          }}
        >
          tattvasudha.org
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  )
}
