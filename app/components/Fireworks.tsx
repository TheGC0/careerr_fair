'use client'

import { useEffect, useRef } from 'react'

const PALETTE = [
  '#f0c030', '#0db890', '#ffffff',
  '#ff8c00', '#40e0d0', '#ffd700',
  '#a8ff60', '#ff6090',
]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  alpha: number; color: string; size: number
}

interface Rocket {
  x: number; y: number
  vy: number; color: string
  trail: { x: number; y: number }[]
}

export default function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let rafId: number
    let frame = 0
    const particles: Particle[] = []
    const rockets: Rocket[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const burst = (cx: number, cy: number, color: string) => {
      const count = 110 + Math.floor(Math.random() * 50)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25
        const speed = Math.random() * 7 + 1.5
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
          vy: Math.sin(angle) * speed * (0.6 + Math.random() * 0.8),
          alpha: 1,
          color: Math.random() > 0.35 ? color : '#ffffff',
          size: Math.random() * 2.8 + 0.5,
        })
      }
    }

    const launch = () => {
      rockets.push({
        x: canvas.width * 0.12 + Math.random() * canvas.width * 0.76,
        y: canvas.height,
        vy: -(13 + Math.random() * 11),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        trail: [],
      })
    }

    const tick = () => {
      ctx.fillStyle = 'rgba(3, 14, 11, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      frame++
      if (frame % 22 === 0) launch()

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 10) r.trail.shift()
        r.y += r.vy
        r.vy += 0.32

        r.trail.forEach((t, ti) => {
          ctx.beginPath()
          ctx.arc(t.x, t.y, 1.5 * (ti / r.trail.length) + 0.3, 0, Math.PI * 2)
          ctx.globalAlpha = (ti / r.trail.length) * 0.65
          ctx.fillStyle = r.color
          ctx.fill()
        })
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        if (r.vy >= 0) {
          burst(r.x, r.y, r.color)
          rockets.splice(i, 1)
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.07
        p.vx *= 0.99
        p.alpha -= 0.012
        if (p.alpha <= 0) { particles.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.globalAlpha = 1
      }

      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}
