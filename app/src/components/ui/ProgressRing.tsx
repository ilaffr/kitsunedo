'use client'

interface ProgressRingProps {
  value: number      // 0–100
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 7,
  color = '#c9a84c',
  trackColor = '#1a1a2e',
  label,
  sublabel,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(value, 100) / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="absolute flex flex-col items-center justify-center">
          {label && <span className="text-mist font-semibold leading-none" style={{ fontSize: size * 0.2 }}>{label}</span>}
          {sublabel && <span className="text-mist-dark leading-none mt-0.5" style={{ fontSize: size * 0.13 }}>{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
