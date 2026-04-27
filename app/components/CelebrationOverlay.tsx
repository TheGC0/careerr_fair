'use client'

import { useEffect, useState } from 'react'

interface Props {
  active: boolean
  onReset?: () => void
}

export default function CelebrationOverlay({ active, onReset }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!active) { setVisible(false); return }
    const show = setTimeout(() => setVisible(true), 500)
    // Auto-dismiss after 7 seconds so the button can be used again
    const dismiss = setTimeout(() => onReset?.(), 7000)
    return () => { clearTimeout(show); clearTimeout(dismiss) }
  }, [active, onReset])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 20, background: 'rgba(3, 14, 11, 0.72)', backdropFilter: 'blur(2px)', cursor: 'pointer' }}
      onClick={() => onReset?.()}
    >
      <div
        className="flex flex-col items-center gap-5 text-center px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.94)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* Decorative stars */}
        <div className="flex items-center gap-4 text-4xl" style={{ animation: 'float-star 2.5s ease-in-out infinite' }}>
          <span>✨</span>
          <span style={{ animationDelay: '0.4s' }}>⭐</span>
          <span style={{ animationDelay: '0.8s' }}>✨</span>
        </div>

        {/* Arabic main headline */}
        <h1
          className="font-bold leading-snug"
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 4rem)',
            color: '#f0c030',
            direction: 'rtl',
            fontFamily: 'Georgia, "Times New Roman", serif',
            textShadow: '0 0 40px rgba(240,192,48,0.6)',
          }}
        >
          يُفتتح معرض التوظيف
        </h1>

        <div
          className="font-bold tabular-nums"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 4.5rem)', color: '#f0c030', textShadow: '0 0 30px rgba(240,192,48,0.5)' }}
        >
          2026
        </div>

        {/* Shimmer divider */}
        <div
          style={{
            width: 200,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #f0c030, #0db890, #f0c030, transparent)',
            backgroundSize: '200% auto',
            animation: 'shimmer 2.5s linear infinite',
          }}
        />

        {/* English sub-headline */}
        <h2
          className="text-white font-semibold tracking-[0.2em] uppercase"
          style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)', letterSpacing: '0.25em' }}
        >
          Grand Opening
        </h2>

        <p
          className="tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}
        >
          KFUPM Career Fair 2026
        </p>

        {/* Under patronage line */}
        <p
          className="text-center max-w-sm"
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', direction: 'rtl', lineHeight: 1.7 }}
        >
          تحت رعاية صاحب السمو الملكي الأمير سعود بن نايف بن عبدالعزيز
        </p>

      </div>
    </div>
  )
}
