'use client'

import { useState } from 'react'
import { QuickReview } from '@/components/srs/QuickReview'
import Link from 'next/link'

interface Card {
  id: string
  vocabularyId: string
  vocabulary: {
    word: string
    reading: string
    meaning: string
    exampleSentence?: string | null
  }
}

export function SRSClient({ cards }: { cards: Card[] }) {
  const [done, setDone] = useState(false)
  const [results, setResults] = useState({ correct: 0, total: 0 })

  if (cards.length === 0) {
    return (
      <div className="bg-ink-light border border-sage/30 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <p className="text-sage font-medium">All caught up!</p>
        <p className="text-mist-dark text-sm mt-1">No cards due right now. Check back later.</p>
        <Link href="/dashboard" className="inline-block mt-4 text-gold text-sm hover:underline">
          Back to dashboard →
        </Link>
      </div>
    )
  }

  if (done) {
    const pct = Math.round((results.correct / results.total) * 100)
    return (
      <div className="bg-ink-light border border-gold/30 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
        <h2 className="text-xl font-jp text-gold mb-1">Session Complete</h2>
        <p className="text-mist-dark text-sm mb-4">
          {results.correct}/{results.total} correct ({pct}%)
        </p>
        <div className="w-full bg-ink rounded-full h-3 mb-6">
          <div className="bg-gold h-3 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="border border-gold/30 text-gold px-4 py-2 rounded-lg text-sm hover:bg-gold/10">
            Dashboard
          </Link>
          <button
            onClick={() => { setDone(false); setResults({ correct: 0, total: 0 }) }}
            className="bg-gold text-ink px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light"
          >
            Review again
          </button>
        </div>
      </div>
    )
  }

  return (
    <QuickReview
      cards={cards}
      onComplete={(r) => { setResults(r); setDone(true) }}
    />
  )
}
