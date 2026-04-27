'use client'

// Clean single-stroke open-palm outline, matching the reference hand icon style.
// A rising scan fill climbs from wrist → fingertips as progress increases.

// Traced clockwise: wrist-BL → left-palm → thumb-out → back → index → middle → ring → pinky → right-palm → wrist-bottom → close
const HAND_PATH =
  'M 40 236 ' +
  'L 40 196 ' +
  // ── thumb ──────────────────────────────────────────
  'C 40 187 34 178 26 170 ' +   // into thumb base-left
  'C 18 161 12 148 12 136 ' +   // up left thumb shaft
  'C 12 124 18 113 28 108 ' +   // thumb tip (left)
  'C 38 104 48 108 52 118 ' +   // around thumb tip
  'C 56 128 56 145 54 158 ' +   // down right thumb shaft
  'C 52 166 48 170 48 170 ' +   // thumb right base
  // ── thumb → index web ──────────────────────────────
  'C 50 168 55 166 62 166 ' +
  // ── index finger ───────────────────────────────────
  'L 62 22 ' +
  'C 62 11 72 8 82 12 ' +
  'C 90 16 91 27 90 40 ' +
  'L 86 160 ' +
  // ── index → middle web ─────────────────────────────
  'C 86 166 88 168 92 166 ' +
  // ── middle finger (tallest) ─────────────────────────
  'L 92 10 ' +
  'C 92 0 102 -3 111 3 ' +
  'C 119 7 120 19 119 32 ' +
  'L 115 158 ' +
  // ── middle → ring web ──────────────────────────────
  'C 115 164 117 167 120 165 ' +
  // ── ring finger ────────────────────────────────────
  'L 120 22 ' +
  'C 120 12 130 8 139 13 ' +
  'C 146 17 148 29 147 40 ' +
  'L 143 160 ' +
  // ── ring → pinky web ───────────────────────────────
  'C 143 166 145 169 148 167 ' +
  // ── pinky ──────────────────────────────────────────
  'L 148 54 ' +
  'C 148 43 158 39 166 44 ' +
  'C 173 49 174 62 173 73 ' +
  'L 168 168 ' +
  // ── right palm + wrist curve ───────────────────────
  'C 168 185 165 212 163 228 ' +
  'C 162 238 155 244 148 246 ' +
  'C 130 248 72 248 54 246 ' +
  'C 48 245 42 241 40 236 ' +
  'Z'

interface Props {
  progress: number
  isActive: boolean
}

export default function HandScanSVG({ progress, isActive }: Props) {
  const VIEW_H = 250

  // scan line climbs from wrist (y=250) to fingertips (y=0)
  const scanY = VIEW_H * (1 - progress / 100)

  const color =
    progress > 75 ? '#f0c030' :
    progress > 40 ? '#70ddb8' :
    '#0db890'

  const strokeOpacity = isActive ? 1 : 0.75

  return (
    <svg
      viewBox="0 -8 200 262"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        {/* Rising clip: shows fill from scanY down to wrist */}
        <clipPath id="hsc-clip">
          <rect x="-20" y={scanY - 8} width="240" height={VIEW_H - scanY + 30} />
        </clipPath>

        {/* Vertical gradient for the fill */}
        <linearGradient id="hsc-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.15" />
        </linearGradient>

        {/* Glow for the filled portion */}
        <filter id="hsc-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tight glow only on the scan line */}
        <filter id="hsc-line" x="-10%" y="-400%" width="120%" height="900%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ① Guide outline — always visible, dim */}
      <path
        d={HAND_PATH}
        fill="rgba(255,255,255,0.04)"
        stroke={`rgba(255,255,255,${strokeOpacity * 0.35})`}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ transition: 'stroke 0.3s ease' }}
      />

      {/* ② Rising fill — clipped below scan line */}
      <path
        d={HAND_PATH}
        fill="url(#hsc-grad)"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        clipPath="url(#hsc-clip)"
        filter={isActive ? 'url(#hsc-glow)' : undefined}
        style={{ transition: 'stroke 0.4s ease' }}
      />

      {/* ③ Scan line — leading edge of the fill */}
      {progress > 0 && (
        <line
          x1="18" y1={scanY}
          x2="182" y2={scanY}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={isActive ? 0.95 : 0.35}
          filter="url(#hsc-line)"
          style={{ transition: 'stroke 0.4s ease' }}
        />
      )}
    </svg>
  )
}
