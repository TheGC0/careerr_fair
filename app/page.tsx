import Link from 'next/link'
import FullscreenButton from '@/app/components/FullscreenButton'

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0c3d2e 0%, #041510 100%)',
      }}
    >
      {/* Ambient decorative blob */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          top: -100, left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(240,192,48,0.07) 0%, transparent 70%)',
          animation: 'ambient-drift 14s ease-in-out infinite',
        }}
      />

      {/* Fullscreen button — top right */}
      <div className="absolute top-6 right-6" style={{ zIndex: 5 }}>
        <FullscreenButton />
      </div>

      {/* Brand header */}
      <div className="text-center mb-14 relative">
        <p
          className="text-xs font-semibold tracking-[0.45em] uppercase mb-3"
          style={{ color: 'rgba(240,192,48,0.7)' }}
        >
          KFUPM
        </p>
        <h1
          className="text-4xl font-bold text-white mb-2 tracking-tight"
        >
          Career Fair 2026
        </h1>
        <h2
          className="text-2xl font-semibold mb-1"
          style={{ color: 'rgba(255,255,255,0.6)', direction: 'rtl' }}
        >
          معرض التوظيف ٢٠٢٦
        </h2>

        <div
          className="mx-auto mt-5"
          style={{
            width: 160, height: 2,
            background: 'linear-gradient(90deg, transparent, #f0c030, #0db890, transparent)',
          }}
        />

        <p
          className="mt-4 text-sm"
          style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}
        >
          Opening Ceremony — اختر نوع الافتتاح
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
        {/* Hand ceremony card */}
        <Link
          href="/ceremony/hand"
          className="group flex-1 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center gap-4 py-12 px-6 text-center transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(13,184,144,0.12) 0%, rgba(4,21,16,0.5) 100%)',
            border: '1px solid rgba(13,184,144,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textDecoration: 'none',
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at center, rgba(13,184,144,0.1) 0%, transparent 70%)' }}
          />

          <span
            className="text-7xl transition-transform duration-300 group-hover:scale-110"
            style={{ filter: 'drop-shadow(0 0 8px rgba(13,184,144,0.5))' }}
          >
            ✋
          </span>

          <div>
            <p
              className="text-lg font-semibold text-white mb-1"
              style={{ direction: 'rtl' }}
            >
              افتتاح يدوي
            </p>
            <p className="text-sm font-medium text-white/70">Hand Ceremony</p>
          </div>

          <p
            className="text-xs leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.35)', direction: 'rtl' }}
          >
            ضع يدك الكاملة على الشاشة
            <br />
            <span style={{ direction: 'ltr', display: 'block' }}>Place your full hand on screen</span>
          </p>

          <div
            className="mt-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(13,184,144,0.15)',
              border: '1px solid rgba(13,184,144,0.3)',
              color: '#0db890',
            }}
          >
            Touch &amp; Hold
          </div>
        </Link>

        {/* Button ceremony card */}
        <Link
          href="/ceremony/button"
          className="group flex-1 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center gap-4 py-12 px-6 text-center transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(240,192,48,0.12) 0%, rgba(4,21,16,0.5) 100%)',
            border: '1px solid rgba(240,192,48,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textDecoration: 'none',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at center, rgba(240,192,48,0.1) 0%, transparent 70%)' }}
          />

          <span
            className="text-7xl transition-transform duration-300 group-hover:scale-110"
            style={{ filter: 'drop-shadow(0 0 8px rgba(240,192,48,0.5))' }}
          >
            🏁
          </span>

          <div>
            <p
              className="text-lg font-semibold text-white mb-1"
              style={{ direction: 'rtl' }}
            >
              افتتاح بالزر
            </p>
            <p className="text-sm font-medium text-white/70">Button Ceremony</p>
          </div>

          <p
            className="text-xs leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.35)', direction: 'rtl' }}
          >
            اضغط الزر لافتتاح المعرض
            <br />
            <span style={{ direction: 'ltr', display: 'block' }}>Press the button to open the fair</span>
          </p>

          <div
            className="mt-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(240,192,48,0.15)',
              border: '1px solid rgba(240,192,48,0.3)',
              color: '#f0c030',
            }}
          >
            Tap to Open
          </div>
        </Link>
      </div>

      {/* Footer */}
      <p
        className="mt-12 text-xs tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.18)' }}
      >
        28 – 30 April 2026 · KFUPM Exhibition Center
      </p>
    </div>
  )
}
