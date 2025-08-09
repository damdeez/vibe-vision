import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 180,
  height: 180,
}
 
export const contentType = 'image/png'
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #000011 0%, #001122 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '20px',
        }}
      >
        {/* Spectrum bars - larger for apple icon */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ width: '8px', height: '40px', background: '#00FF00', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '60px', background: '#33FF33', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '80px', background: '#66FF66', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '100px', background: '#99FF99', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '120px', background: '#FFFF00', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '100px', background: '#FFCC00', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '80px', background: '#FF9900', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '60px', background: '#FF6600', borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '40px', background: '#FF3300', borderRadius: '2px' }} />
        </div>
        
        {/* Title */}
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            color: '#00FF00',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            textAlign: 'center',
            textShadow: '0 0 10px #00FF00',
          }}
        >
          VIBE VISION
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}