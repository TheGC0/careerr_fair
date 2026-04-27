'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Fireworks from '@/app/components/Fireworks'
import CelebrationOverlay from '@/app/components/CelebrationOverlay'
import HandScanImage from '@/app/components/HandScanImage'

interface TouchPoint { id: number; x: number; y: number; size: number }

// KFUPM brand gradient — matches the ceremony slide background
const BG = 'linear-gradient(135deg, #008359 0%, #106466 50%, #4e99ae 100%)'
const MAX_TRACKED_CONTACTS = 6
const HAND_CONTACT_GRACE_MS = 180

function getTouchSize(touch: Touch) {
  const radiusX = touch.radiusX || 0
  const radiusY = touch.radiusY || 0

  return Math.max(72, Math.min(160, Math.max(radiusX, radiusY) * 2.2))
}

export default function HandCeremony() {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [handDetected, setHandDetected] = useState(false)
  const [progress, setProgress]       = useState(0)
  const [launched, setLaunched]       = useState(false)

  const touchCountRef = useRef(0)
  const lastContactAtRef = useRef(0)
  const progressRef   = useRef(0)
  const launchedRef   = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (launchedRef.current) return
      const count = touchCountRef.current
      const hasHandContact = count > 0 || performance.now() - lastContactAtRef.current < HAND_CONTACT_GRACE_MS
      setHandDetected(hasHandContact)

      if (hasHandContact) {
        const rate = count >= 3 ? 2.8 : count >= 2 ? 2.2 : 1.8
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

  useEffect(() => {
    const zone = document.getElementById('hand-zone')!
    const sync = (e: TouchEvent) => {
      const target = e.target
      if (target instanceof Element && target.closest('a, button')) return

      e.preventDefault()
      const pts: TouchPoint[] = Array.from(e.touches)
        .slice(0, MAX_TRACKED_CONTACTS)
        .map(t => ({
          id: t.identifier,
          x: window.innerWidth > window.innerHeight ? t.clientY : t.clientX,
          y: window.innerWidth > window.innerHeight ? window.innerWidth - t.clientX : t.clientY,
          size: getTouchSize(t),
        }))
      touchCountRef.current = pts.length
      if (pts.length > 0) {
        lastContactAtRef.current = performance.now()
        setHandDetected(true)
      }
      setTouchPoints(pts)
    }
    zone.addEventListener('touchstart',  sync, { passive: false })
    zone.addEventListener('touchmove',   sync, { passive: false })
    zone.addEventListener('touchend',    sync, { passive: false })
    zone.addEventListener('touchcancel', sync, { passive: false })
    return () => {
      zone.removeEventListener('touchstart',  sync)
      zone.removeEventListener('touchmove',   sync)
      zone.removeEventListener('touchend',    sync)
      zone.removeEventListener('touchcancel', sync)
    }
  }, [])

  const reset = useCallback(() => {
    launchedRef.current = false
    progressRef.current = 0
    touchCountRef.current = 0
    lastContactAtRef.current = 0
    setLaunched(false); setHandDetected(false); setProgress(0); setTouchPoints([])
  }, [])

  const isActive   = handDetected
  const accentColor = progress > 75 ? '#f0c030' : '#ffffff'

  return (
    <div
      id="hand-zone"
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: BG, touchAction: 'none', WebkitUserSelect: 'none' }}
    >
      <div className="portrait-stage" style={{ background: BG }}>
      {/* ── Decorative arcs (matching KFUPM slide) ── */}
      <svg className="absolute top-0 right-0 pointer-events-none" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="160" cy="0" r="100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        <circle cx="160" cy="0" r="70"  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="140" height="140" viewBox="0 0 140 140">
        <circle cx="0" cy="140" r="90"  fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5"/>
        <circle cx="0" cy="140" r="60"  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      </svg>

      {/* ── Dot grids ── */}
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

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 text-center pt-10" style={{ zIndex: 5 }}>
        <Image
          src="/Centered_Inverted.svg"
          alt="KFUPM Career Fair 2026 opening"
          width={300}
          height={166}
          priority
          className="mx-auto h-auto"
          style={{ width: 'min(34vw, 300px)', opacity: 0.88 }}
        />
      </div>

      {/* Touch feedback dots */}
      {touchPoints.map(pt => (
        <div key={pt.id} className="absolute pointer-events-none rounded-full"
          style={{
            left: pt.x - pt.size / 2, top: pt.y - pt.size / 2, width: pt.size, height: pt.size,
            background: isActive ? 'rgba(240,192,48,0.25)' : 'rgba(255,255,255,0.2)',
            border: `2px solid ${isActive ? '#f0c030' : 'rgba(255,255,255,0.6)'}`,
            boxShadow: `0 0 14px ${isActive ? 'rgba(240,192,48,0.5)' : 'rgba(255,255,255,0.3)'}`,
            animation: 'pulse-dot 0.6s ease-in-out infinite',
            zIndex: 6,
          }} />
      ))}

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">

        {/* ── Vertical hand scan ── */}
        <div
          className="relative"
          style={{
            width: 'min(82vmin, 900px)',
            height: 'min(82vmin, 900px)',
          }}
        >
          {/* Glow backdrop */}
          <div className="absolute pointer-events-none" style={{
            inset: '-15%', borderRadius: '50%',
            background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 65%)`,
            transition: 'background 0.4s ease',
          }} />
          <div className="absolute inset-0">
            <HandScanImage progress={progress} isActive={isActive} />
          </div>
        </div>

        {/* Progress % */}
        {isActive && !launched && (
          <div className="font-bold tabular-nums"
            style={{ fontSize: 44, color: '#f0c030', textShadow: '0 0 24px rgba(240,192,48,0.7)' }}>
            {progress}%
          </div>
        )}
      </div>

      {/* Hand contact indicator */}
      {!launched && (
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
          <div
            className="rounded-full transition-all duration-200"
            style={{
              width: 14,
              height: 14,
              background: handDetected ? '#f0c030' : 'rgba(255,255,255,0.25)',
              boxShadow: handDetected ? '0 0 12px rgba(240,192,48,0.8)' : 'none',
              transform: handDetected ? 'scale(1.35)' : 'scale(1)',
            }}
          />
          <p className="text-xs text-white/40">
            {handDetected ? 'Palm detected - hold steady' : 'Place the center of your palm on the screen'}
          </p>
        </div>
      )}

      </div>

      {!launched && (
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-colors"
          style={{ zIndex: 30, color: 'rgba(255,255,255,0.65)' }}
        >
          <span>←</span> Back
        </Link>
      )}

      <Fireworks active={launched} />
      <CelebrationOverlay active={launched} onReset={reset} />

      <style>{`
        .portrait-stage {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        @media (orientation: landscape) {
          .portrait-stage {
            inset: auto;
            left: 50%;
            top: 50%;
            width: 100vh;
            height: 100vw;
            transform: translate(-50%, -50%) rotate(90deg);
            transform-origin: center;
          }
        }
      `}</style>
    </div>
  )
}
