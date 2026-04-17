'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ReviewCard {
  id: string
  vocabularyId: string
  vocabulary: {
    word: string
    reading: string
    meaning: string
    exampleSentence?: string | null
  }
}

interface QuickReviewProps {
  cards: ReviewCard[]
  onComplete: (results: { correct: number; total: number }) => void
}

type Phase = 'question' | 'revealed'

const qualityLabels = [
  { q: 1, label: 'Forgot',   color: 'bg-fox/20 text-fox border-fox/40',         short: '✗' },
  { q: 3, label: 'Hard',     color: 'bg-gold/10 text-gold border-gold/40',       short: '~' },
  { q: 4, label: 'Good',     color: 'bg-sage/10 text-sage border-sage/40',       short: '✓' },
  { q: 5, label: 'Easy',     color: 'bg-sage/20 text-sage-light border-sage/60', short: '★' },
]

export function QuickReview({ cards, onComplete }: QuickReviewProps) {
  const [idx, setIdx]         = useState(0)
  const [phase, setPhase]     = useState<Phase>('question')
  const [correct, setCorrect] = useState(0)
  const [loading, setLoading] = useState(false)

  const card = cards[idx]
  const isLast = idx === cards.length - 1

  const reveal = useCallback(() => setPhase('revealed'), [])

  const submit = useCallback(async (quality: number) => {
    if (loading) return
    setLoading(true)
    try {
      await fetch('/api/srs/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: card.id, quality }),
      })
    } catch { /* non-critical — still advance */ }

    if (quality >= 4) setCorrect(c => c + 1)

    if (isLast) {
      onComplete({ correct: quality >= 4 ? correct + 1 : correct, total: cards.length })
    } else {
      setIdx(i => i + 1)
      setPhase('question')
    }
    setLoading(false)
  }, [card, correct, isLast, loading, cards.length, onComplete])

  if (!card) return null

  return (
    <div className="max-w-md mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-ink rounded-full h-2">
          <div
            className="bg-gold h-2 rounded-full transition-all"
            style={{ width: `${(idx / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-mist-dark text-sm flex-shrink-0">{idx + 1}/{cards.length}</span>
      </div>

      {/* Card */}
      <div
        className={cn(
          'bg-ink-light border rounded-2xl p-8 text-center cursor-pointer select-none transition-all',
          phase === 'question' ? 'border-gold/20 hover:border-gold/40' : 'border-gold/40'
        )}
        onClick={phase === 'question' ? reveal : undefined}
      >
        <div className="text-4xl font-jp text-mist mb-2">{card.vocabulary.word}</div>
        {phase === 'question' ? (
          <p className="text-mist-dark text-sm mt-4">Tap to reveal</p>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="text-gold font-jp text-lg">{card.vocabulary.reading}</div>
            <div className="text-mist">{card.vocabulary.meaning}</div>
            {card.vocabulary.exampleSentence && (
              <div className="text-mist-dark text-sm mt-3 pt-3 border-t border-gold/10 font-jp">
                {card.vocabulary.exampleSentence}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons — only after reveal */}
      {phase === 'revealed' && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {qualityLabels.map(({ q, label, color }) => (
            <button
              key={q}
              onClick={() => submit(q)}
              disabled={loading}
              className={cn(
                'border rounded-xl py-3 flex flex-col items-center gap-1 text-xs font-medium transition-opacity disabled:opacity-50',
                color
              )}
            >
              <span className="text-base">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
