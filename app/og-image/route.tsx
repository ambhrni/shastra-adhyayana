import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tattvasudha.org'

    console.log('OG image: fetching font from', `${baseUrl}/fonts/NotoSansDevanagari.ttf`)

    let fonts: { name: string; data: ArrayBuffer; style: 'normal' }[] = []
    let fontLoaded = false
    try {
      const fontRes = await fetch(`${baseUrl}/fonts/NotoSansDevanagari.ttf`)
      console.log('Font fetch status:', fontRes.status, fontRes.ok)
      if (fontRes.ok) {
        const fontData = await fontRes.arrayBuffer()
        console.log('Font data size:', fontData.byteLength)
        fonts = [{ name: 'NotoDevanagari', data: fontData, style: 'normal' }]
        fontLoaded = true
      } else {
        console.error('Font fetch failed:', fontRes.status, fontRes.statusText)
      }
    } catch (fontErr) {
      console.error('Font fetch error:', fontErr)
    }

    console.log('Font loaded:', fontLoaded, '— rendering ImageResponse...')

    const devaFamily = fontLoaded ? 'NotoDevanagari' : 'serif'

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
          <div style={{ color: '#FF8C00', fontSize: '36px', fontFamily: devaFamily }}>
            ॥ श्रीः ॥
          </div>
          <div style={{
            color: '#FFFFFF', fontSize: '88px',
            fontWeight: 'bold', fontFamily: 'serif',
            letterSpacing: '-2px',
          }}>
            Tattvasudhā
          </div>
          <div style={{ color: '#FF6B00', fontSize: '52px', fontFamily: devaFamily }}>
            तत्त्वसुधा
          </div>
          <div style={{ width: '480px', height: '1px', backgroundColor: '#7A3000' }} />
          <div style={{
            color: '#F0DFC0', fontSize: '22px',
            fontFamily: 'serif', textAlign: 'center',
          }}>
            A jñānayajña — Madhva tattvavāda aligned Vēda Vēdānta śāstra study
          </div>
          <div style={{ color: '#FF8C00', fontSize: '18px', fontFamily: 'serif', letterSpacing: '3px' }}>
            tattvasudha.org
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts }
    )
  } catch (err) {
    console.error('OG image fatal error:', err)
    return new Response(`OG image error: ${err}`, { status: 500 })
  }
}
