import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width:'1200px', height:'630px', background:'#1A0500',
                    display:'flex', flexDirection:'column', alignItems:'center',
                    justifyContent:'center', gap:'24px', padding:'60px' }}>
        <div style={{ width:'80px', height:'2px', backgroundColor:'#FF8C00' }} />
        <div style={{ color:'#FFFFFF', fontSize:'80px', fontWeight:'bold',
                      fontFamily:'serif', letterSpacing:'-1px' }}>Tattvasudhā</div>
        <div style={{ color:'#FF8C00', fontSize:'18px', fontFamily:'serif',
                      letterSpacing:'3px' }}>tattvasudha.org</div>
        <div style={{ width:'400px', height:'1px', backgroundColor:'#7A3000' }} />
        <div style={{ color:'#F0DFC0', fontSize:'22px', fontFamily:'serif',
                      textAlign:'center', lineHeight:'1.6' }}>
          A jñānayajña — Madhva tattvavāda aligned Vēda Vēdānta śāstra study
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
