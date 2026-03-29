import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
        }}
      >
        <div style={{
          color: '#FF8C00',
          fontSize: '52px',
          fontWeight: 'bold',
          fontFamily: 'serif',
        }}>
          Tattvasudhā
        </div>
        <div style={{
          color: '#F0DFC0',
          fontSize: '26px',
          fontFamily: 'serif',
        }}>
          tattvasudha.org
        </div>
        <div style={{
          color: '#F0DFC0',
          fontSize: '22px',
          fontFamily: 'serif',
          marginTop: '10px',
        }}>
          A jñānayajña for Mādhva Dvaita Vedānta śāstra study
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
