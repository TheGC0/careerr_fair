import Link from 'next/link'
import FullscreenButton from '@/app/components/FullscreenButton'

export default function Home() {
  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16 select-none"
      style={{
        background: 'var(--ceremony-background)',
      }}
    >
      {/* Decorative arcs */}
      <svg className="absolute top-0 right-0 pointer-events-none" width="180" height="180" viewBox="0 0 180 180">
        <circle cx="180" cy="0" r="120" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        <circle cx="180" cy="0" r="85"  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="0" cy="160" r="100" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5"/>
        <circle cx="0" cy="160" r="68"  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      </svg>
      {/* Dot grids */}
      <svg className="absolute top-16 right-12 pointer-events-none" width="44" height="44" viewBox="0 0 44 44">
        {[0,16,32].map(x => [0,16,32].map(y => (
          <circle key={`${x}${y}`} cx={x+6} cy={y+6} r="2.5" fill="rgba(255,255,255,0.22)" />
        )))}
      </svg>
      <svg className="absolute bottom-16 left-12 pointer-events-none" width="44" height="44" viewBox="0 0 44 44">
        {[0,16,32].map(x => [0,16].map(y => (
          <circle key={`${x}${y}`} cx={x+6} cy={y+6} r="2.5" fill="rgba(255,255,255,0.18)" />
        )))}
      </svg>

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
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
            ضع ثلاثة أصابع على الشاشة
            <br />
            <span style={{ direction: 'ltr', display: 'block' }}>Place three fingertips on screen</span>
          </p>

          <div
            className="mt-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(13,184,144,0.15)',
              border: '1px solid rgba(13,184,144,0.3)',
              color: '#0db890',
            }}
          >
            Finger Hold
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

        {/* Two-button ceremony card */}
        <Link
          href="/ceremony/two-buttons"
          className="group flex-1 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center gap-4 py-12 px-6 text-center transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(78,153,174,0.14) 0%, rgba(4,21,16,0.5) 100%)',
            border: '1px solid rgba(126,255,229,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textDecoration: 'none',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at center, rgba(126,255,229,0.12) 0%, transparent 70%)' }}
          />

          <div className="relative h-20 w-28 transition-transform duration-300 group-hover:scale-110">
            <span
              className="absolute left-2 top-3 h-14 w-14 rounded-full"
              style={{
                background: 'radial-gradient(circle at 40% 35%, #f0c030, #0db890 60%, #0a5040)',
                boxShadow: '0 0 12px rgba(126,255,229,0.35), inset 0 -3px 8px rgba(0,0,0,0.28)',
              }}
            />
            <span
              className="absolute right-2 top-3 h-14 w-14 rounded-full"
              style={{
                background: 'radial-gradient(circle at 40% 35%, #f0c030, #0db890 60%, #0a5040)',
                boxShadow: '0 0 12px rgba(126,255,229,0.35), inset 0 -3px 8px rgba(0,0,0,0.28)',
              }}
            />
          </div>

          <div>
            <p
              className="text-lg font-semibold text-white mb-1"
              style={{ direction: 'rtl' }}
            >
              افتتاح مزدوج
            </p>
            <p className="text-sm font-medium text-white/70">Two-Button Ceremony</p>
          </div>

          <p
            className="text-xs leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.35)', direction: 'rtl' }}
          >
            اضغط الزرين معًا
            <br />
            <span style={{ direction: 'ltr', display: 'block' }}>Hold both buttons together</span>
          </p>

          <div
            className="mt-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(126,255,229,0.12)',
              border: '1px solid rgba(126,255,229,0.25)',
              color: '#a8fff0',
            }}
          >
            Dual Hold
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
