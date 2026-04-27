'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Fireworks from '@/app/components/Fireworks'
import CelebrationOverlay from '@/app/components/CelebrationOverlay'

export default function ButtonCeremony() {
  const [pressed, setPressed] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const launchedRef = useRef(false)
  const nextRippleId = useRef(0)

  const triggerPress = useCallback((clientX?: number, clientY?: number) => {
    if (launchedRef.current) return
    setPressed(true)

    // Add ripple at touch/click position (or center)
    const btn = document.getElementById('open-btn')
    const rect = btn?.getBoundingClientRect()
    const cx = clientX !== undefined && rect ? clientX - rect.left : (rect ? rect.width / 2 : 0)
    const cy = clientY !== undefined && rect ? clientY - rect.top : (rect ? rect.height / 2 : 0)

    const id = nextRippleId.current++
    setRipples(r => [...r, { id, x: cx, y: cy }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700)

    setTimeout(() => {
      setPressed(false)
      launchedRef.current = true
      setLaunched(true)
    }, 320)
  }, [])

  // Touch handler for iPad
  useEffect(() => {
    const btn = document.getElementById('open-btn')!

    const onTouch = (e: TouchEvent) => {
      e.preventDefault()
      if (launchedRef.current) return
      const t = e.touches[0] ?? e.changedTouches[0]
      triggerPress(t.clientX, t.clientY)
    }

    btn.addEventListener('touchstart', onTouch, { passive: false })
    return () => btn.removeEventListener('touchstart', onTouch)
  }, [triggerPress])

  const reset = useCallback(() => {
    launchedRef.current = false
    setLaunched(false)
    setPressed(false)
    setRipples([])
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 50% 55%, #0b3d30 0%, #041510 100%)',
        touchAction: 'none',
      }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 700, height: 700,
          top: -200, right: -200,
          background: 'radial-gradient(circle, rgba(240,192,48,0.05) 0%, transparent 65%)',
          animation: 'ambient-drift 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          bottom: -100, left: -100,
          background: 'radial-gradient(circle, rgba(13,184,144,0.07) 0%, transparent 65%)',
          animation: 'ambient-drift 10s ease-in-out infinite reverse',
        }}
      />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        style={{ zIndex: 5 }}
      >
        <span>←</span> Back
      </Link>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 text-center pt-10">
        <p
          className="text-xs font-medium tracking-[0.35em] uppercase"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          KFUPM Career Fair 2026
        </p>
        <h1
          className="mt-1 text-xl font-semibold"
          style={{ color: 'rgba(255,255,255,0.75)', direction: 'rtl' }}
        >
          افتتاح معرض التوظيف
        </h1>
      </div>

      {/* Decorative ring behind button */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 340, height: 340,
          border: '1px solid rgba(240,192,48,0.1)',
          animation: 'pulse-ring 3s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400,
          border: '1px solid rgba(240,192,48,0.06)',
          animation: 'pulse-ring 3s ease-in-out infinite 1s',
        }}
      />

      {/* The Button */}
      <button
        id="open-btn"
        onClick={e => triggerPress(e.clientX, e.clientY)}
        disabled={launched}
        className="relative rounded-full overflow-hidden"
        style={{
          width: 240,
          height: 240,
          background: pressed
            ? 'radial-gradient(circle at 40% 35%, #c8a020, #0a6050)'
            : 'radial-gradient(circle at 40% 35%, #f0c030, #0db890 60%, #0a5040)',
          boxShadow: pressed
            ? '0 4px 20px rgba(0,0,0,0.6), inset 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(240,192,48,0.2)'
            : '0 12px 40px rgba(0,0,0,0.5), inset 0 -4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(240,192,48,0.3)',
          transform: pressed ? 'scale(0.94) translateY(4px)' : 'scale(1) translateY(0)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
          animation: !launched && !pressed ? 'btn-glow 2.5s ease-in-out infinite' : 'none',
          cursor: launched ? 'default' : 'pointer',
          border: 'none',
          outline: 'none',
          touchAction: 'none',
        }}
      >
        {/* Ripple effects */}
        {ripples.map(rp => (
          <span
            key={rp.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: rp.x - 12,
              top: rp.y - 12,
              width: 24,
              height: 24,
              background: 'rgba(255,255,255,0.6)',
              animation: 'ripple-out 0.65s ease-out forwards',
            }}
          />
        ))}

        {/* Button face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          {/* Top shine */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '65%', height: '35%',
              top: '10%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 80%)',
            }}
          />

          <span style={{ fontSize: 52, lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
            🏁
          </span>
          <span
            className="font-bold text-white"
            style={{ fontSize: 18, direction: 'rtl', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            افتح المعرض
          </span>
          <span
            className="font-medium text-white/75"
            style={{ fontSize: 11, letterSpacing: '0.15em', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
          >
            OPEN THE FAIR
          </span>
        </div>
      </button>

      {/* Prompt below button */}
      {!launched && (
        <p
          className="mt-10 text-sm tracking-wide"
          style={{ color: 'rgba(255,255,255,0.38)' }}
        >
          {pressed ? 'Opening...' : 'Press the button to begin'}
        </p>
      )}

      <Fireworks active={launched} />
      <CelebrationOverlay active={launched} onReset={reset} />

      <style>{`
        @keyframes ripple-out {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(18); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
