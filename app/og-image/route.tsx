import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Read font once at module load time — not inside the request handler.
// Convert Node Buffer → ArrayBuffer correctly (Buffer.buffer is the backing
// pool, not the slice; use Uint8Array to get the exact bytes Satori needs).
function loadFont(): ArrayBuffer | null {
  try {
    const fontPath = path.join(process.cwd(), 'public/fonts/NotoSansDevanagari-Regular.ttf')
    if (!fs.existsSync(fontPath)) return null
    const buf = fs.readFileSync(fontPath)
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

const devanagariFont = loadFont()

export async function GET() {
  const fonts = devanagariFont
    ? [{ name: 'Devanagari', data: devanagariFont, style: 'normal' as const }]
    : []

  const devaFamily = fonts.length > 0 ? 'Devanagari' : 'serif'

  try {
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
  } catch (e) {
    console.error('ImageResponse failed with custom font, retrying without:', e)
    // Fallback: render without any custom font
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
          <div style={{ color: '#FF8C00', fontSize: '72px', fontWeight: 'bold', fontFamily: 'serif' }}>
            Tattvasudhā
          </div>
          <div style={{ color: '#F0DFC0', fontSize: '22px', fontFamily: 'serif', marginTop: '10px' }}>
            A jñānayajña for Mādhva Dvaita Vedānta śāstra study
          </div>
          <div style={{ color: '#F0DFC0', fontSize: '20px', fontFamily: 'serif' }}>
            tattvasudha.org
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
