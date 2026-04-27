'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Fireworks from '@/app/components/Fireworks'
import CelebrationOverlay from '@/app/components/CelebrationOverlay'

type ButtonSide = 'left' | 'right'

interface Ripple {
  id: number
  x: number
  y: number
}

const BG = 'linear-gradient(135deg, #008359 0%, #106466 50%, #4e99ae 100%)'
const BUTTONS: { side: ButtonSide; label: string }[] = [
  { side: 'left', label: 'LEFT' },
  { side: 'right', label: 'RIGHT' },
]

export default function TwoButtonsCeremony() {
  const [pressedButtons, setPressedButtons] = useState<Record<ButtonSide, boolean>>({
    left: false,
    right: false,
  })
  const [launched, setLaunched] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [ripples, setRipples] = useState<Record<ButtonSide, Ripple[]>>({
    left: [],
    right: [],
  })

  const pointerRefs = useRef<Record<ButtonSide, Set<number>>>({
    left: new Set<number>(),
    right: new Set<number>(),
  })
  const keyboardRefs = useRef<Record<ButtonSide, boolean>>({ left: false, right: false })
  const pressedRef = useRef<Record<ButtonSide, boolean>>({ left: false, right: false })
  const progressRef = useRef(0)
  const launchedRef = useRef(false)
  const nextRippleId = useRef(0)
  const processingTicks = Array.from({ length: 72 }, (_, i) => i)
  const activeTicks = Math.ceil((holdProgress / 100) * processingTicks.length)
  const bothPressed = pressedButtons.left && pressedButtons.right
  const onePressed = pressedButtons.left || pressedButtons.right

  const syncPressedState = useCallback(() => {
    const next = {
      left: pointerRefs.current.left.size > 0 || keyboardRefs.current.left,
      right: pointerRefs.current.right.size > 0 || keyboardRefs.current.right,
    }
    pressedRef.current = next
    setPressedButtons(next)
  }, [])

  const clearActiveInputs = useCallback(() => {
    pointerRefs.current.left.clear()
    pointerRefs.current.right.clear()
    keyboardRefs.current.left = false
    keyboardRefs.current.right = false
    pressedRef.current = { left: false, right: false }
    setPressedButtons({ left: false, right: false })
  }, [])

  const addRipple = useCallback((side: ButtonSide, clientX?: number, clientY?: number) => {
    const btn = document.getElementById(`dual-open-${side}`)
    const rect = btn?.getBoundingClientRect()
    const cx = clientX !== undefined && rect ? clientX - rect.left : (rect ? rect.width / 2 : 0)
    const cy = clientY !== undefined && rect ? clientY - rect.top : (rect ? rect.height / 2 : 0)

    const id = nextRippleId.current++
    setRipples(current => ({
      ...current,
      [side]: [...current[side], { id, x: cx, y: cy }],
    }))
    window.setTimeout(() => {
      setRipples(current => ({
        ...current,
        [side]: current[side].filter(ripple => ripple.id !== id),
      }))
    }, 700)
  }, [])

  const completeHold = useCallback(() => {
    if (launchedRef.current) return
    launchedRef.current = true
    progressRef.current = 100
    setHoldProgress(100)
    clearActiveInputs()
    setLaunched(true)
  }, [clearActiveInputs])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (launchedRef.current) return

      const synced = pressedRef.current.left && pressedRef.current.right
      const next = synced
        ? Math.min(100, progressRef.current + 1.7)
        : Math.max(0, progressRef.current - 3.4)

      if (next === progressRef.current) return

      progressRef.current = next
      setHoldProgress(Math.round(next))

      if (next >= 100) completeHold()
    }, 30)

    return () => window.clearInterval(id)
  }, [completeHold])

  const reset = useCallback(() => {
    launchedRef.current = false
    progressRef.current = 0
    clearActiveInputs()
    setLaunched(false)
    setHoldProgress(0)
    setRipples({ left: [], right: [] })
  }, [clearActiveInputs])

  const pressButton = useCallback((side: ButtonSide, pointerId: number, clientX: number, clientY: number) => {
    if (launchedRef.current) return
    pointerRefs.current[side].add(pointerId)
    syncPressedState()
    addRipple(side, clientX, clientY)
  }, [addRipple, syncPressedState])

  const releaseButton = useCallback((side: ButtonSide, pointerId: number) => {
    pointerRefs.current[side].delete(pointerId)
    syncPressedState()
  }, [syncPressedState])

  const statusText = launched
    ? ''
    : bothPressed
      ? `Keep holding together... ${holdProgress}%`
      : onePressed
        ? 'Hold the second button too'
        : 'Press and hold both buttons together'

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none flex flex-col items-center justify-center"
      style={{ background: BG, touchAction: 'none' }}
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

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        style={{ zIndex: 5 }}
      >
        <span>←</span> Back
      </Link>

      <div className="absolute top-0 left-0 right-0 text-center pt-7 pointer-events-none">
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

      <div className="dual-page-content">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-white" style={{ direction: 'rtl' }}>
            اضغط الزرين معًا
          </p>
          <p className="text-sm tracking-[0.18em] uppercase text-white/45">
            Synchronized Opening
          </p>
        </div>

        <div className="dual-buttons" aria-label="Two synchronized hold buttons">
          {BUTTONS.map(({ side, label }) => (
            <div key={side} className="dual-control">
              {!launched && (
                <div
                  className={`dual-processing-ring ${bothPressed ? 'dual-processing-ring-active' : ''}`}
                  aria-hidden="true"
                >
                  <div className="dual-ring-ticks">
                    {processingTicks.map(tick => (
                      <span
                        key={tick}
                        style={{
                          opacity: tick < activeTicks ? 0.95 : 0.14,
                          background: tick < activeTicks
                            ? 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,192,48,0.76))'
                            : 'linear-gradient(180deg, rgba(234,255,251,0.42), rgba(126,255,229,0.14))',
                          boxShadow: tick < activeTicks ? '0 0 12px rgba(240,192,48,0.55)' : 'none',
                          transform: `rotate(${tick * 5}deg) translateY(calc((var(--control-size) / -2) + 18px))`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="dual-ring-core" />
                </div>
              )}

              <button
                id={`dual-open-${side}`}
                onPointerDown={e => {
                  if (e.pointerType === 'mouse' && e.button !== 0) return
                  e.preventDefault()
                  e.currentTarget.setPointerCapture(e.pointerId)
                  pressButton(side, e.pointerId, e.clientX, e.clientY)
                }}
                onPointerUp={e => {
                  e.preventDefault()
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId)
                  }
                  releaseButton(side, e.pointerId)
                }}
                onPointerCancel={e => releaseButton(side, e.pointerId)}
                onLostPointerCapture={e => releaseButton(side, e.pointerId)}
                onKeyDown={e => {
                  if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return
                  e.preventDefault()
                  keyboardRefs.current[side] = true
                  syncPressedState()
                  addRipple(side)
                }}
                onKeyUp={e => {
                  if (e.key !== ' ' && e.key !== 'Enter') return
                  e.preventDefault()
                  keyboardRefs.current[side] = false
                  syncPressedState()
                }}
                disabled={launched}
                aria-pressed={pressedButtons[side]}
                aria-label={`${label.toLowerCase()} synchronized hold button`}
                className="dual-button"
                style={{
                  background: pressedButtons[side]
                    ? 'radial-gradient(circle at 40% 35%, #c8a020, #0a6050)'
                    : 'radial-gradient(circle at 40% 35%, #f0c030, #0db890 60%, #0a5040)',
                  boxShadow: pressedButtons[side]
                    ? '0 4px 20px rgba(0,0,0,0.6), inset 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(240,192,48,0.2)'
                    : '0 12px 40px rgba(0,0,0,0.5), inset 0 -4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(240,192,48,0.3)',
                  transform: pressedButtons[side] ? 'scale(0.94) translateY(4px)' : 'scale(1) translateY(0)',
                  animation: !launched && !pressedButtons[side] ? 'btn-glow 2.5s ease-in-out infinite' : 'none',
                  cursor: launched ? 'default' : 'pointer',
                }}
              >
                {ripples[side].map(ripple => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: ripple.x - 12,
                      top: ripple.y - 12,
                      width: 24,
                      height: 24,
                      background: 'rgba(255,255,255,0.6)',
                      animation: 'dual-ripple-out 0.65s ease-out forwards',
                    }}
                  />
                ))}
                <span className="dual-button-shine" />
              </button>

              <p className="dual-button-label">{label}</p>
            </div>
          ))}
        </div>

        {!launched && (
          <div className="text-center space-y-2">
            <p
              className="text-sm tracking-wide"
              style={{ color: bothPressed ? '#f0c030' : 'rgba(255,255,255,0.45)' }}
            >
              {statusText}
            </p>
            <div className="mx-auto h-1 w-64 max-w-[70vw] rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${holdProgress}%`,
                  background: 'linear-gradient(90deg, #f0c030, #ffffff)',
                  boxShadow: bothPressed ? '0 0 18px rgba(240,192,48,0.65)' : 'none',
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Fireworks active={launched} />
      <CelebrationOverlay active={launched} onReset={reset} />

      <style>{`
        .dual-page-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1.5rem, 4vh, 3rem);
          width: 100%;
          min-height: 100%;
          padding: clamp(6rem, 14vh, 8rem) 1.5rem clamp(2rem, 7vh, 4rem);
        }

        .dual-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(1.75rem, 7vw, 6rem);
          width: 100%;
        }

        .dual-control {
          --control-size: clamp(170px, 34vmin, 320px);
          position: relative;
          width: var(--control-size);
          height: var(--control-size);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dual-processing-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          pointer-events: none;
          filter: drop-shadow(0 0 14px rgba(126, 255, 229, 0.26));
        }

        .dual-processing-ring::before {
          content: '';
          position: absolute;
          inset: calc(var(--control-size) * 0.08);
          border-radius: inherit;
          border: 2px solid rgba(196, 255, 242, 0.32);
          box-shadow:
            0 0 30px rgba(126, 255, 229, 0.22),
            inset 0 0 20px rgba(126, 255, 229, 0.08);
        }

        .dual-processing-ring::after {
          content: '';
          position: absolute;
          inset: calc(var(--control-size) * 0.035);
          border-radius: inherit;
          border: 1px solid rgba(196, 255, 242, 0.13);
        }

        .dual-ring-ticks {
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }

        .dual-ring-ticks span {
          position: absolute;
          left: calc(50% - 2px);
          top: calc(50% - 10px);
          width: 4px;
          height: 20px;
          border-radius: 9999px;
          transform-origin: 2px 10px;
          transition: opacity 0.12s linear, background 0.12s linear, box-shadow 0.12s linear;
        }

        .dual-ring-core {
          position: absolute;
          inset: calc(var(--control-size) * 0.14);
          border-radius: inherit;
          background:
            radial-gradient(circle, transparent 58%, rgba(126, 255, 229, 0.1) 59%, transparent 66%),
            conic-gradient(from 0deg, transparent 0deg, rgba(126, 255, 229, 0.18) 36deg, transparent 92deg);
          animation: dual-processing-core-spin 3.4s linear infinite;
        }

        .dual-processing-ring-active .dual-ring-core {
          animation-duration: 0.9s;
        }

        .dual-button {
          position: relative;
          width: calc(var(--control-size) * 0.66);
          height: calc(var(--control-size) * 0.66);
          overflow: hidden;
          border: none;
          outline: none;
          border-radius: 9999px;
          touch-action: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        .dual-button-shine {
          position: absolute;
          left: 17.5%;
          top: 10%;
          width: 65%;
          height: 35%;
          border-radius: 9999px;
          pointer-events: none;
          background: radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 80%);
        }

        .dual-button-label {
          position: absolute;
          bottom: -1.4rem;
          left: 0;
          right: 0;
          text-align: center;
          color: rgba(255,255,255,0.42);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.3em;
        }

        @media (max-width: 520px) {
          .dual-page-content {
            gap: 1.75rem;
            padding-inline: 0.75rem;
          }

          .dual-buttons {
            gap: 0.8rem;
          }

          .dual-control {
            --control-size: clamp(136px, 44vw, 170px);
          }

          .dual-ring-ticks span {
            width: 3px;
            height: 16px;
            left: calc(50% - 1.5px);
            top: calc(50% - 8px);
            transform-origin: 1.5px 8px;
          }
        }

        @keyframes dual-processing-core-spin {
          to { transform: rotate(-360deg); }
        }

        @keyframes dual-ripple-out {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(16); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
