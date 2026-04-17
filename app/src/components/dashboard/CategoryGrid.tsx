'use client'

import { ProgressRing } from '@/components/ui/ProgressRing'
import Link from 'next/link'

interface Category {
  id: string
  label: string
  icon: string
  total: number
  learned: number
  color: string
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-mist mb-3">Study Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const pct = cat.total > 0 ? Math.round((cat.learned / cat.total) * 100) : 0
          return (
            <Link
              key={cat.id}
              href={`/lessons?category=${cat.id}`}
              className="bg-ink-light border border-gold/15 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold/40 transition-colors group"
            >
              <ProgressRing value={pct} size={64} color={cat.color} trackColor="#0d0d1a"
                label={cat.icon} />
              <div className="text-center">
                <div className="text-sm font-medium text-mist group-hover:text-gold transition-colors">{cat.label}</div>
                <div className="text-xs text-mist-dark mt-0.5">{cat.learned}/{cat.total}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
