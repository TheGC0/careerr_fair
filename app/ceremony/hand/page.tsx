'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Fireworks from '@/app/components/Fireworks'
import CelebrationOverlay from '@/app/components/CelebrationOverlay'
import HandScanSVG from '@/app/components/HandScanSVG'

interface TouchPoint {
  id: number
  x: number
  y: number
}

export default function HandCeremony() {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [progress, setProgress] = useState(0)
  const [launched, setLaunched] = useState(false)

  const touchCountRef = useRef(0)
  const progressRef = useRef(0)
  const launchedRef = useRef(false)

  // Single interval drives all progress logic
  useEffect(() => {
    const id = setInterval(() => {
      if (launchedRef.current) return

      const count = touchCountRef.current
      if (count >= 3) {
        const rate = count >= 5 ? 2.8 : count >= 4 ? 2.2 : 1.6
        progressRef.current = Math.min(100, progressRef.current + rate)
      } else {
        progressRef.current = Math.max(0, progressRef.current - 0.6)
      }

      setProgress(Math.round(progressRef.current))

      if (progressRef.current >= 100 && !launchedRef.current) {
        launchedRef.current = true
        setLaunched(true)
      }
    }, 50)

    return () => clearInterval(id)
  }, [])

  // Touch listeners — non-passive so we can call preventDefault
  useEffect(() => {
    const zone = document.getElementById('hand-zone')!

    const sync = (e: TouchEvent) => {
      e.preventDefault()
      const pts: TouchPoint[] = Array.from(e.touches).map(t => ({
        id: t.identifier,
        x: t.clientX,
        y: t.clientY,
      }))
      touchCountRef.current = pts.length
      setTouchPoints(pts)
    }

    zone.addEventListener('touchstart', sync, { passive: false })
    zone.addEventListener('touchmove', sync, { passive: false })
    zone.addEventListener('touchend', sync, { passive: false })
    zone.addEventListener('touchcancel', sync, { passive: false })

    return () => {
      zone.removeEventListener('touchstart', sync)
      zone.removeEventListener('touchmove', sync)
      zone.removeEventListener('touchend', sync)
      zone.removeEventListener('touchcancel', sync)
    }
  }, [])

  const reset = useCallback(() => {
    launchedRef.current = false
    progressRef.current = 0
    touchCountRef.current = 0
    setLaunched(false)
    setProgress(0)
    setTouchPoints([])
  }, [])

  const isActive = touchPoints.length >= 3

  const accentColor =
    progress > 75 ? '#f0c030' :
    progress > 40 ? '#60d8b0' :
    '#0db890'

  return (
    <div
      id="hand-zone"
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(150deg, #082e24 0%, #0b4a38 45%, #0d5a48 75%, #0a4535 100%)',
        touchAction: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ── KFUPM poster-style golden-amber blob (top-left) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '72vmin', height: '72vmin',
          top: '-18vmin', left: '-18vmin',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 44% 44%, ' +
            'rgba(210,168,12,0.92) 0%, ' +
            'rgba(160,170,18,0.65) 32%, ' +
            'rgba(60,130,55,0.30) 58%, ' +
            'transparent 72%)',
        }}
      />
      {/* Secondary teal highlight (bottom-right, like poster) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '50vmin', height: '50vmin',
          bottom: '-12vmin', right: '-12vmin',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 55% 55%, rgba(20,140,100,0.35) 0%, transparent 65%)',
        }}
      />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 transition-colors text-sm"
        style={{ zIndex: 5, color: 'rgba(255,255,255,0.38)' }}
      >
        ← Back
      </Link>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 text-center pt-10" style={{ zIndex: 5 }}>
        <p
          className="text-xs font-medium tracking-[0.35em] uppercase"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          KFUPM Career Fair 2026
        </p>
        <h1
          className="mt-1 text-xl font-semibold"
          style={{ color: 'rgba(255,255,255,0.7)', direction: 'rtl' }}
        >
          افتتاح معرض التوظيف
        </h1>
      </div>

      {/* Touch feedback dots at actual finger positions */}
      {touchPoints.map(pt => (
        <div
          key={pt.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: pt.x - 28,
            top: pt.y - 28,
            width: 56,
            height: 56,
            background: isActive ? 'rgba(240,192,48,0.28)' : 'rgba(13,184,144,0.28)',
            border: `2px solid ${isActive ? '#f0c030' : '#0db890'}`,
            boxShadow: `0 0 14px ${isActive ? 'rgba(240,192,48,0.5)' : 'rgba(13,184,144,0.4)'}`,
            animation: 'pulse-dot 0.6s ease-in-out infinite',
            zIndex: 6,
          }}
        />
      ))}

      {/* Center: hand scan visual */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">

        {/* Hand SVG with glow backdrop */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 220, height: 308 }}
        >
          {/* Soft glow behind the hand */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 65%, ${accentColor}18 0%, transparent 70%)`,
              transition: 'background 0.4s ease',
              transform: 'scale(1.3)',
            }}
          />
          <HandScanSVG progress={progress} isActive={isActive} />
        </div>

        {/* Instruction text */}
        {!launched && (
          <div className="text-center space-y-1">
            <p
              className="text-xl font-medium transition-colors duration-300"
              style={{ color: isActive ? accentColor : 'rgba(255,255,255,0.7)', direction: 'rtl' }}
            >
              {isActive ? 'استمر في الضغط...' : 'ضع يدك الكاملة هنا'}
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {isActive ? 'Keep holding to open the fair' : 'Place your full hand to open the fair'}
            </p>
          </div>
        )}

        {/* Progress % shown while active */}
        {isActive && !launched && (
          <div
            className="font-bold tabular-nums"
            style={{
              fontSize: 44,
              color: accentColor,
              textShadow: `0 0 20px ${accentColor}80`,
              transition: 'color 0.4s ease',
            }}
          >
            {progress}%
          </div>
        )}
      </div>

      {/* Finger count indicator at bottom */}
      {!launched && (
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width: 11, height: 11,
                  background: touchPoints.length >= i ? accentColor : 'rgba(255,255,255,0.14)',
                  boxShadow: touchPoints.length >= i ? `0 0 8px ${accentColor}` : 'none',
                  transform: touchPoints.length >= i ? 'scale(1.3)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {touchPoints.length === 0
              ? 'Touch the screen with your hand'
              : touchPoints.length >= 3
              ? 'Hand detected — hold steady'
              : `${3 - touchPoints.length} more finger${3 - touchPoints.length !== 1 ? 's' : ''} needed`}
          </p>
        </div>
      )}

      <Fireworks active={launched} />
      <CelebrationOverlay active={launched} onReset={reset} />
    </div>
  )
}
