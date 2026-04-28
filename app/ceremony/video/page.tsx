'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Stage = 'waiting' | 'tapToPlay' | 'playing'

export default function VideoScreen() {
  const [stage, setStage] = useState<Stage>('waiting')
  const [connected, setConnected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const tryPlay = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.muted = false
    video.play().then(() => {
      setStage('playing')
    }).catch(() => {
      setStage('tapToPlay')
    })
  }

  // Expose tryPlay on the ref so the SSE callback (closed over stale state) can always call fresh version
  const tryPlayRef = useRef(tryPlay)
  useEffect(() => { tryPlayRef.current = tryPlay })

  // SSE connection
  useEffect(() => {
    const es = new EventSource('/api/ceremony')
    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)
    es.onmessage = (e) => {
      if (e.data === 'launch') tryPlayRef.current()
    }
    return () => es.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isPreVideo = stage === 'waiting' || stage === 'tapToPlay'

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
      {/* Waiting / Done branding */}
      {isPreVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 pointer-events-none">
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

        </div>
      )}

      {/* Status bar — bottom of screen */}
      {stage === 'waiting' && (
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: connected ? '#0db890' : '#666',
            boxShadow: connected ? '0 0 10px rgba(13,184,144,0.9)' : 'none',
            transition: 'all 0.4s',
            animation: connected ? 'pulse-dot 1.4s ease-in-out infinite' : 'none',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.3em' }}>
            {connected ? 'READY' : 'CONNECTING…'}
          </span>
        </div>
      )}

      {/* Tap-to-play fallback — browser blocked autoplay */}
      {stage === 'tapToPlay' && (
        <button
          className="absolute inset-0 flex flex-col items-center justify-center gap-6"
          style={{ background: 'rgba(0,0,0,0.75)', zIndex: 30, cursor: 'pointer', border: 'none' }}
          onClick={tryPlay}
        >
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(240,192,48,0.15)',
            border: '2px solid rgba(240,192,48,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#f0c030">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, letterSpacing: '0.15em' }}>
            TAP TO PLAY
          </p>
        </button>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src="/My Movie.mp4"
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'contain',
          opacity: stage === 'playing' ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
