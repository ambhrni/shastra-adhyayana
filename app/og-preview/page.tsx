"use client"

export default function OgPreview() {
  return (
    <>
      <style>{`body { margin: 0; padding: 0; }`}</style>
      <div style={{
        width: '1200px', height: '630px',
        background: '#1A0500',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '20px', padding: '60px',
        overflow: 'hidden',
      }}>
        <div style={{ color: '#FF8C00', fontSize: '32px',
          fontFamily: '"Noto Sans Devanagari", serif' }}>
          ॥ श्रीः ॥
        </div>
        <div style={{
          color: '#FFFFFF', fontSize: '88px', fontWeight: 'bold',
          fontFamily: 'Georgia, serif',
          letterSpacing: '-2px', lineHeight: '1',
        }}>
          Tattvasudhā
        </div>
        <div style={{ color: '#FF6B00', fontSize: '52px',
          fontFamily: '"Noto Sans Devanagari", serif' }}>
          तत्त्वसुधा
        </div>
        <div style={{ width: '480px', height: '1px',
          backgroundColor: '#7A3000' }} />
        <div style={{
          color: '#F0DFC0', fontSize: '22px',
          fontFamily: 'Georgia, serif',
          textAlign: 'center', lineHeight: '1.6',
        }}>
          A jñānayajña — Madhva tattvavāda aligned Vēda Vēdānta śāstra study
        </div>
        <div style={{
          color: '#FF8C00', fontSize: '18px',
          fontFamily: 'Georgia, serif', letterSpacing: '3px',
        }}>
          tattvasudha.org
        </div>
      </div>
    </>
  )
}
