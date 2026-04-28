'use client'

import { useEffect, useRef, useState } from 'react'

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

  const tryPlayRef = useRef(tryPlay)
  useEffect(() => { tryPlayRef.current = tryPlay })

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

  return (
    <div className="fixed inset-0 select-none overflow-hidden">
      {/* Background image — always mounted, fades out when video plays */}
      <div
        className="absolute inset-0"
        style={{
          opacity: stage === 'playing' ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Slide_1.jpg"
          alt=""
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Connecting indicator — only shown when NOT connected */}
      {stage === 'waiting' && !connected && (
        <div
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#666',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.3em' }}>
            CONNECTING…
          </span>
        </div>
      )}

      {/* Tap-to-play fallback */}
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
