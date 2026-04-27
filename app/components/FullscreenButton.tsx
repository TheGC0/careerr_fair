'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

function isIPad() {
  return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function canUseAppFullscreen() {
  if (typeof document === 'undefined') return false
  return !isIPad() && document.fullscreenEnabled
}

function subscribeToFullscreenAvailability() {
  return () => {}
}

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canShowButton = useSyncExternalStore(
    subscribeToFullscreenAvailability,
    canUseAppFullscreen,
    () => false
  )

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  if (!canShowButton) return null

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.65)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.11)'
        el.style.borderColor = 'rgba(255,255,255,0.28)'
        el.style.color = 'rgba(255,255,255,0.9)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.06)'
        el.style.borderColor = 'rgba(255,255,255,0.15)'
        el.style.color = 'rgba(255,255,255,0.65)'
      }}
    >
      {isFullscreen ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
            <path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
          </svg>
          Exit Fullscreen
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
            <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
          </svg>
          Fullscreen
        </>
      )}
    </button>
  )
}
