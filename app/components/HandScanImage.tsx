'use client'

interface Props {
  progress: number
  isActive: boolean
}

export default function HandScanImage({ progress, isActive }: Props) {
  const isGold = progress > 75
  const isMid  = progress > 40

  const accent = isGold ? '#f0c030' : isMid ? '#70ddb8' : '#ffffff'
  const handMask = {
    maskImage: 'url(/hand.png)',
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskSize: 'contain',
    WebkitMaskImage: 'url(/hand.png)',
    WebkitMaskPosition: 'center',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
  }

  // scan line climbs from bottom (wrist) → top (fingertips)
  const scanTop = `${100 - progress}%`

  return (
    <div className="relative w-full h-full" style={{ isolation: 'isolate' }}>

      {/* ① Guide outline — dim white, always visible */}
      <div
        role="img"
        aria-label="Hand placement guide"
        className="absolute inset-0 pointer-events-none"
        style={{
          ...handMask,
          background: 'rgba(255,255,255,0.92)',
          opacity: isActive ? 0.52 : 0.4,
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.34))',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ② Colored fill — rises from wrist as progress increases */}
      {progress > 0 && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            ...handMask,
            background: accent,
            clipPath: `inset(${100 - progress}% 0% 0% 0%)`,
            filter: `drop-shadow(0 0 24px ${accent}99)`,
            transition: 'background 0.4s ease, filter 0.4s ease',
          }}
        />
      )}

      {/* ③ Scan line — leading edge of the fill */}
      {progress > 0 && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: scanTop,
            left: '8%', right: '8%',
            height: 3,
            borderRadius: 2,
            background: accent,
            boxShadow: `0 0 14px 5px ${accent}80`,
            opacity: isActive ? 0.95 : 0.4,
            transition: 'background 0.4s ease, box-shadow 0.4s ease',
          }}
        />
      )}
    </div>
  )
}
