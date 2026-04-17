interface StatsCardProps {
  label: string
  value: string | number
  sub?: string
  icon: string
  accent?: 'gold' | 'fox' | 'sage' | 'mist'
}

const accentColors: Record<string, string> = {
  gold: 'text-gold border-gold/30 bg-gold/5',
  fox:  'text-fox border-fox/30 bg-fox/5',
  sage: 'text-sage border-sage/30 bg-sage/5',
  mist: 'text-mist border-mist/20 bg-mist/5',
}

export function StatsCard({ label, value, sub, icon, accent = 'gold' }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 ${accentColors[accent]}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold text-mist leading-none">{value}</div>
        <div className="text-sm font-medium mt-0.5">{label}</div>
        {sub && <div className="text-xs text-mist-dark mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}
