'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Fireworks from '@/app/components/Fireworks'
import CelebrationOverlay from '@/app/components/CelebrationOverlay'

export default function ButtonCeremony() {
  const [pressed, setPressed] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const launchedRef = useRef(false)
  const holdProgressRef = useRef(0)
  const holdTimerRef = useRef<number | null>(null)
  const nextRippleId = useRef(0)
  const processingTicks = Array.from({ length: 72 }, (_, i) => i)
  const activeTicks = Math.ceil((holdProgress / 100) * processingTicks.length)

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current === null) return
    window.clearInterval(holdTimerRef.current)
    holdTimerRef.current = null
  }, [])

  const addRipple = useCallback((clientX?: number, clientY?: number) => {
    const btn = document.getElementById('open-btn')
    const rect = btn?.getBoundingClientRect()
    const cx = clientX !== undefined && rect ? clientX - rect.left : (rect ? rect.width / 2 : 0)
    const cy = clientY !== undefined && rect ? clientY - rect.top : (rect ? rect.height / 2 : 0)

    const id = nextRippleId.current++
    setRipples(r => [...r, { id, x: cx, y: cy }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700)
  }, [])

  const completeHold = useCallback(() => {
    if (launchedRef.current) return
    clearHoldTimer()
    holdProgressRef.current = 100
    setHoldProgress(100)
    setPressed(false)
    launchedRef.current = true
    setLaunched(true)
    // Signal the video screen to play
    fetch('/api/ceremony', { method: 'POST' }).catch(() => {})
  }, [clearHoldTimer])

  const startHold = useCallback((clientX?: number, clientY?: number) => {
    if (launchedRef.current) return
    clearHoldTimer()
    holdProgressRef.current = 0
    setHoldProgress(0)
    setPressed(true)
    addRipple(clientX, clientY)

    holdTimerRef.current = window.setInterval(() => {
      if (launchedRef.current) return
      const next = Math.min(100, holdProgressRef.current + 4)
      holdProgressRef.current = next
      setHoldProgress(Math.round(next))

      if (next >= 100) completeHold()
    }, 30)
  }, [addRipple, clearHoldTimer, completeHold])

  const cancelHold = useCallback(() => {
    clearHoldTimer()
    if (launchedRef.current) return
    holdProgressRef.current = 0
    setHoldProgress(0)
    setPressed(false)
  }, [clearHoldTimer])

  useEffect(() => clearHoldTimer, [clearHoldTimer])

  const reset = useCallback(() => {
    clearHoldTimer()
    launchedRef.current = false
    holdProgressRef.current = 0
    setLaunched(false)
    setPressed(false)
    setHoldProgress(0)
    setRipples([])
  }, [clearHoldTimer])

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #008359 0%, #106466 50%, #4e99ae 100%)',
        touchAction: 'none',
      }}
    >
      {/* Decorative arcs */}
      <svg className="absolute top-0 right-0 pointer-events-none" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="160" cy="0" r="100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        <circle cx="160" cy="0" r="70"  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="140" height="140" viewBox="0 0 140 140">
        <circle cx="0" cy="140" r="90"  fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5"/>
        <circle cx="0" cy="140" r="60"  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      </svg>
      {/* Dot grids */}
      <svg className="absolute top-14 right-10 pointer-events-none" width="44" height="44" viewBox="0 0 44 44">
        {[0,16,32].map(x => [0,16,32].map(y => (
          <circle key={`${x}${y}`} cx={x+6} cy={y+6} r="2.5" fill="rgba(255,255,255,0.22)" />
        )))}
      </svg>
      <svg className="absolute bottom-14 left-10 pointer-events-none" width="44" height="44" viewBox="0 0 44 44">
        {[0,16,32].map(x => [0,16].map(y => (
          <circle key={`${x}${y}`} cx={x+6} cy={y+6} r="2.5" fill="rgba(255,255,255,0.18)" />
        )))}
      </svg>

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        style={{ zIndex: 5 }}
      >
        <span>←</span> Back
      </Link>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 text-center pt-7 pointer-events-none" style={{ zIndex: 2 }}>
        <Image
          src="/Centered_Inverted.svg"
          alt="KFUPM Career Fair 2026 opening"
          width={300}
          height={166}
          priority
          className="mx-auto h-auto"
          style={{ width: 'min(26vw, 230px)', opacity: 0.88 }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        {/* Decorative ring behind button */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 430, height: 430,
            border: '1px solid rgba(240,192,48,0.1)',
            animation: 'pulse-ring 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500, height: 500,
            border: '1px solid rgba(240,192,48,0.06)',
            animation: 'pulse-ring 3s ease-in-out infinite 1s',
          }}
        />

        {/* The Button */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 440, height: 440 }}
        >
          {!launched && (
            <div
              className={`processing-ring ${pressed ? 'processing-ring-active' : ''}`}
              aria-hidden="true"
            >
              <div className="processing-ring-ticks">
                {processingTicks.map(tick => (
                  <span
                    key={tick}
                    style={{
                      opacity: tick < activeTicks ? 0.95 : 0.14,
                      background: tick < activeTicks
                        ? 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,192,48,0.76))'
                        : 'linear-gradient(180deg, rgba(234,255,251,0.42), rgba(126,255,229,0.14))',
                      boxShadow: tick < activeTicks ? '0 0 12px rgba(240,192,48,0.55)' : 'none',
                      transform: `rotate(${tick * 5}deg) translateY(-194px)`,
                    }}
                  />
                ))}
              </div>
              <div className="processing-ring-core" />
            </div>
          )}

          <button
            id="open-btn"
            onPointerDown={e => {
              if (e.pointerType === 'mouse' && e.button !== 0) return
              e.preventDefault()
              e.currentTarget.setPointerCapture(e.pointerId)
              startHold(e.clientX, e.clientY)
            }}
            onPointerUp={e => {
              e.preventDefault()
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId)
              }
              cancelHold()
            }}
            onPointerCancel={cancelHold}
            onLostPointerCapture={cancelHold}
            onKeyDown={e => {
              if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return
              e.preventDefault()
              startHold()
            }}
            onKeyUp={e => {
              if (e.key !== ' ' && e.key !== 'Enter') return
              e.preventDefault()
              cancelHold()
            }}
            disabled={launched}
            aria-busy={pressed}
            aria-label={`Hold to open the fair. ${holdProgress} percent complete.`}
            className="relative rounded-full overflow-hidden"
            style={{
              width: 300,
              height: 300,
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

            {/* Empty button face */}
            <div className="absolute inset-0">
              {/* Top shine */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '65%', height: '35%',
                  left: '17.5%',
                  top: '10%',
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 80%)',
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Hold progress below button */}
      {!launched && pressed && (
        <div
          className="absolute left-0 right-0 h-5 flex items-center justify-center"
          style={{ top: 'calc(50% + 255px)', zIndex: 2 }}
          aria-live="polite"
        >
          <p
            className="text-sm tracking-wide"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            Keep holding... {holdProgress}%
          </p>
        </div>
      )}

      <Fireworks active={launched} />
      <CelebrationOverlay active={launched} onReset={reset} />

      <style>{`
        .processing-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          pointer-events: none;
          filter: drop-shadow(0 0 14px rgba(126, 255, 229, 0.26));
        }

        .processing-ring::before {
          content: '';
          position: absolute;
          inset: 28px;
          border-radius: inherit;
          border: 2px solid rgba(196, 255, 242, 0.32);
          box-shadow:
            0 0 30px rgba(126, 255, 229, 0.22),
            inset 0 0 20px rgba(126, 255, 229, 0.08);
        }

        .processing-ring::after {
          content: '';
          position: absolute;
          inset: 12px;
          border-radius: inherit;
          border: 1px solid rgba(196, 255, 242, 0.13);
        }

        .processing-ring-ticks {
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }

        .processing-ring-ticks span {
          position: absolute;
          left: calc(50% - 2px);
          top: calc(50% - 11px);
          width: 4px;
          height: 22px;
          border-radius: 9999px;
          transform-origin: 2px 11px;
          transition: opacity 0.12s linear, background 0.12s linear, box-shadow 0.12s linear;
        }

        .processing-ring-core {
          position: absolute;
          inset: 48px;
          border-radius: inherit;
          background:
            radial-gradient(circle, transparent 58%, rgba(126, 255, 229, 0.1) 59%, transparent 66%),
            conic-gradient(from 0deg, transparent 0deg, rgba(126, 255, 229, 0.18) 36deg, transparent 92deg);
          animation: processing-core-spin 3.4s linear infinite;
        }

        .processing-ring-active .processing-ring-core {
          animation-duration: 0.9s;
        }

        @keyframes processing-sweep {
          to { transform: rotate(360deg); }
        }

        @keyframes processing-core-spin {
          to { transform: rotate(-360deg); }
        }

        @keyframes ripple-out {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(18); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
