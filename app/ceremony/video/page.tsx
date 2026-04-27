'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Stage = 'idle' | 'armed' | 'playing' | 'done'

export default function VideoScreen() {
  const [stage, setStage] = useState<Stage>('idle')
  const [connected, setConnected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<Stage>('idle')

  // Keep ref in sync so SSE callback always sees latest stage
  useEffect(() => { stageRef.current = stage }, [stage])

  // SSE connection — auto-reconnects via EventSource retry
  useEffect(() => {
    let es: EventSource

    function connect() {
      es = new EventSource('/api/ceremony')

      es.onopen = () => setConnected(true)

      es.onmessage = (e) => {
        if (e.data !== 'launch') return
        if (stageRef.current !== 'armed') return // not armed yet, ignore
        setStage('playing')
        const video = videoRef.current
        if (video) {
          video.currentTime = 0
          video.play().catch(() => {})
        }
      }

      es.onerror = () => {
        setConnected(false)
        // EventSource retries automatically; just reflect status
      }
    }

    connect()
    return () => es?.close()
  }, [])

  const arm = () => {
    // This user-gesture unlocks autoplay with audio for the session
    const video = videoRef.current
    if (video) {
      // Prime: load + muted-play then pause — unlocks the audio context
      video.muted = true
      video.play().then(() => {
        video.pause()
        video.currentTime = 0
        video.muted = false
      }).catch(() => {})
    }
    setStage('armed')
  }

  const isPreVideo = stage === 'idle' || stage === 'armed' || stage === 'done'

  return (
    <div
      className="fixed inset-0 select-none"
      style={{
        background: stage === 'playing'
          ? '#000'
          : 'linear-gradient(135deg, #008359 0%, #106466 50%, #4e99ae 100%)',
        transition: 'background 0.6s ease',
      }}
    >
      {/* ── Waiting / Done overlay ── */}
      {isPreVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 pointer-events-none">
          {/* Decorative arcs */}
          <svg className="absolute top-0 right-0" width="220" height="220" viewBox="0 0 220 220">
            <circle cx="220" cy="0" r="150" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5"/>
            <circle cx="220" cy="0" r="105" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          </svg>
          <svg className="absolute bottom-0 left-0" width="200" height="200" viewBox="0 0 200 200">
            <circle cx="0" cy="200" r="130" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            <circle cx="0" cy="200" r="90"  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </svg>

          <Image
            src="/Centered_Inverted.svg"
            alt="KFUPM Career Fair 2026"
            width={480}
            height={266}
            priority
            className="h-auto"
            style={{ width: 'min(40vw, 480px)', opacity: 0.9 }}
          />

          {stage === 'done' && (
            <div className="flex flex-col items-center gap-3 mt-2">
              <p className="text-3xl font-bold" style={{ color: '#f0c030', textShadow: '0 0 24px rgba(240,192,48,0.7)', direction: 'rtl' }}>
                يُفتتح معرض التوظيف
              </p>
              <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Grand Opening — KFUPM Career Fair 2026
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Arm button (idle) / status (armed) ── */}
      {isPreVideo && stage !== 'done' && (
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
          {/* Connection indicator */}
          <div className="flex items-center gap-2">
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: connected ? '#0db890' : '#888',
              boxShadow: connected ? '0 0 8px rgba(13,184,144,0.8)' : 'none',
              transition: 'all 0.3s',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, letterSpacing: '0.15em' }}>
              {connected ? 'CONNECTED' : 'CONNECTING…'}
            </span>
          </div>

          {stage === 'idle' && (
            <button
              onClick={arm}
              className="pointer-events-auto px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-200"
              style={{
                background: 'rgba(13,184,144,0.18)',
                border: '1px solid rgba(13,184,144,0.45)',
                color: '#0db890',
                letterSpacing: '0.25em',
              }}
            >
              Arm Screen
            </button>
          )}

          {stage === 'armed' && (
            <div className="flex flex-col items-center gap-2">
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: '#f0c030',
                boxShadow: '0 0 14px rgba(240,192,48,0.9)',
                animation: 'pulse-dot 1.2s ease-in-out infinite',
              }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '0.3em' }}>
                READY
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Video element (always mounted, invisible until playing) ── */}
      <video
        ref={videoRef}
        src="/video.MP4"
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'contain',
          opacity: stage === 'playing' ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
        onEnded={() => setStage('done')}
      />
    </div>
  )
}
