import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tattvasudha.org'

  const fontData = await fetch(
    new URL('/fonts/NotoSansDevanagari-Regular.ttf', baseUrl)
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #1A0500 0%, #3D0E00 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
        }}
      >
        {/* ॥श्रीः॥ */}
        <div
          style={{
            fontFamily: 'NotoSansDevanagari',
            fontSize: 36,
            color: '#FFAA00',
            marginBottom: 44,
            letterSpacing: 8,
          }}
        >
          ॥ श्रीः ॥
        </div>

        {/* Tattvasudhā */}
        <div
          style={{
            fontFamily: 'serif',
            fontSize: 88,
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: 12,
            letterSpacing: -1,
          }}
        >
          Tattvasudhā
        </div>

        {/* तत्त्वसुधा */}
        <div
          style={{
            fontFamily: 'NotoSansDevanagari',
            fontSize: 52,
            color: '#FF8C00',
            marginBottom: 50,
          }}
        >
          तत्त्वसुधा
        </div>

        {/* Divider */}
        <div
          style={{
            width: 480,
            height: 1,
            backgroundColor: '#7A3000',
            marginBottom: 34,
            opacity: 0.8,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: '#F0DFC0',
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: 0.5,
            lineHeight: 1.6,
          }}
        >
          A jñānayajña for Mādhva Dvaita Vedānta śāstra study
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 18,
            color: '#FFAA00',
            letterSpacing: 2.5,
            marginTop: 4,
          }}
        >
          tattvasudha.org
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansDevanagari',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
