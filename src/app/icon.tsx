import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#000011',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Spectrum bars */}
        <div style={{ display: 'flex', alignItems: 'end', gap: '1px' }}>
          <div style={{ width: '2px', height: '8px', background: '#00FF00' }} />
          <div style={{ width: '2px', height: '12px', background: '#33FF33' }} />
          <div style={{ width: '2px', height: '16px', background: '#66FF66' }} />
          <div style={{ width: '2px', height: '20px', background: '#FFFF00' }} />
          <div style={{ width: '2px', height: '16px', background: '#FF9900' }} />
          <div style={{ width: '2px', height: '12px', background: '#FF6600' }} />
          <div style={{ width: '2px', height: '8px', background: '#FF3300' }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}