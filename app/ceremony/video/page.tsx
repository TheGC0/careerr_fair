'use client'

import { useEffect, useRef, useState } from 'react'

type Stage = 'waiting' | 'tapToPlay' | 'playing'

export default function VideoScreen() {
  const [stage, setStage] = useState<Stage>('waiting')
  const [connected, setConnected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Start buffering immediately on mount so video is ready when signal arrives
  useEffect(() => {
    videoRef.current?.load()
  }, [])

  const tryPlay = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.muted = true

    // Wait for the first real frame before switching stage — prevents black flash
    const onPlaying = () => {
      video.removeEventListener('playing', onPlaying)
      video.muted = false
      setStage('playing')
    }
    video.addEventListener('playing', onPlaying)

    const doPlay = () => {
      video.play().catch(() => {
        video.removeEventListener('playing', onPlaying)
        video.muted = false
        setStage('tapToPlay')
      })
    }

    // If the video hasn't buffered enough yet, wait for canplay first
    if (video.readyState >= 3) {
      doPlay()
    } else {
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay)
        doPlay()
      }
      video.addEventListener('canplay', onCanPlay)
    }
  }

  const tryPlayRef = useRef(tryPlay)
  useEffect(() => { tryPlayRef.current = tryPlay })

  useEffect(() => {
    let es: EventSource
    let reconnectTimer: ReturnType<typeof setTimeout>
    let watchdogTimer: ReturnType<typeof setInterval>
    let lastActivity = Date.now()
    let alive = true

    const connect = () => {
      if (!alive) return
      try { es?.close() } catch {}

      es = new EventSource('/api/ceremony')

      es.onopen = () => {
        lastActivity = Date.now()
        setConnected(true)
      }

      // 'launch' comes as a default message event
      es.onmessage = (e) => {
        lastActivity = Date.now()
        if (e.data === 'launch') tryPlayRef.current()
      }

      // Named ping event — just update liveness timestamp
      es.addEventListener('ping', () => {
        lastActivity = Date.now()
      })

      es.onerror = () => {
        setConnected(false)
        es.close()
        // Reconnect after 2 s
        clearTimeout(reconnectTimer)
        reconnectTimer = setTimeout(connect, 2000)
      }
    }

    // Watchdog: if no ping/message for 25 s, force a fresh connection
    watchdogTimer = setInterval(() => {
      if (Date.now() - lastActivity > 25_000) {
        setConnected(false)
        clearTimeout(reconnectTimer)
        connect()
      }
    }, 5_000)

    connect()

    return () => {
      alive = false
      clearTimeout(reconnectTimer)
      clearInterval(watchdogTimer)
      try { es?.close() } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 select-none overflow-hidden"
      style={{
        backgroundColor: '#000',
        backgroundImage: stage !== 'playing' ? 'url(/Slide_1.jpg)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Connecting indicator */}
      {stage === 'waiting' && !connected && (
        <div
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#666' }} />
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

      {/* Video — only visible once actually playing */}
      <video
        ref={videoRef}
        src="/My Movie.mp4"
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'contain',
          opacity: stage === 'playing' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
