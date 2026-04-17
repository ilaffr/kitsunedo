'use client'

import { ProgressRing } from '@/components/ui/ProgressRing'

interface XPStreakCardProps {
  todayXP: number
  dailyGoal: number
  pct: number
  streak: number
  totalXP: number
}

export function XPStreakCard({ todayXP, dailyGoal, pct, streak, totalXP }: XPStreakCardProps) {
  return (
    <div className="bg-ink-light border border-gold/20 rounded-xl p-5 flex items-center gap-6">
      <ProgressRing value={pct} size={90} label={`${pct}%`} sublabel="daily" color="#c9a84c" trackColor="#0d0d1a" />
      <div className="flex-1">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-mist">{todayXP}</span>
          <span className="text-mist-dark text-sm">/ {dailyGoal} XP today</span>
        </div>
        <div className="w-full bg-ink rounded-full h-2 mb-3">
          <div
            className="bg-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-4">
          <div>
            <div className="text-lg font-bold text-fox">🔥 {streak}</div>
            <div className="text-xs text-mist-dark">day streak</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gold">{totalXP.toLocaleString()}</div>
            <div className="text-xs text-mist-dark">total XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}
