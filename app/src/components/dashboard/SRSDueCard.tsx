import Link from 'next/link'

export function SRSDueCard({ due }: { due: number }) {
  return (
    <Link
      href="/srs"
      className="bg-ink-light border border-gold/20 rounded-xl p-5 flex items-center justify-between hover:border-gold/50 transition-colors group"
    >
      <div>
        <div className="text-3xl font-bold text-gold">{due}</div>
        <div className="text-sm text-mist-dark mt-0.5">cards due for review</div>
        {due > 0 && (
          <div className="text-xs text-fox mt-1">Start reviewing →</div>
        )}
        {due === 0 && (
          <div className="text-xs text-sage mt-1">All caught up! ✓</div>
        )}
      </div>
      <div className="text-4xl opacity-60 group-hover:opacity-100 transition-opacity">🎴</div>
    </Link>
  )
}
