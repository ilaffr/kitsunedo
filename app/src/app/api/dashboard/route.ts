import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { apiOk, apiError } from '@/lib/utils'

const XP_PER_EXERCISE = 10
const XP_PER_LESSON   = 50
const DAILY_XP_GOAL   = 100

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const userId = session.user.id
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [allProgress, srsStats, totalLessons, srsQueue] = await Promise.all([
    prisma.userProgress.findMany({ where: { userId } }),
    prisma.sRSItem.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { easiness: true },
    }),
    prisma.lesson.count(),
    prisma.sRSItem.count({ where: { userId, nextReview: { lte: now } } }),
  ])

  const completedLessons = new Set(
    allProgress.filter(p => p.completed && p.section === 'EXERCISES').map(p => p.lessonId)
  ).size

  const totalXP = allProgress.reduce((sum, p) => sum + p.exercisesCompleted * XP_PER_EXERCISE, 0)
    + completedLessons * XP_PER_LESSON

  // XP earned today
  const todayProgress = allProgress.filter(p => p.updatedAt >= todayStart)
  const todayXP = todayProgress.reduce((sum, p) => sum + p.exercisesCompleted * XP_PER_EXERCISE, 0)

  // Streak: count consecutive days with activity
  const activityDates = new Set(
    allProgress.filter(p => p.completed).map(p =>
      new Date(p.completedAt ?? p.updatedAt).toDateString()
    )
  )
  let streak = 0
  const d = new Date(todayStart)
  while (activityDates.has(d.toDateString())) {
    streak++
    d.setDate(d.getDate() - 1)
  }

  // Category progress
  const vocabTotal   = await prisma.vocabulary.count()
  const vocabLearned = await prisma.sRSItem.count({ where: { userId, repetitions: { gte: 1 } } })
  const grammarTotal = await prisma.grammarPoint.count()

  const categories = [
    { id: 'hiragana',   label: 'Hiragana',   icon: 'あ', total: 46,         learned: Math.min(vocabLearned, 46),  color: '#c9a84c' },
    { id: 'katakana',   label: 'Katakana',   icon: 'ア', total: 46,         learned: 0,                           color: '#d4522a' },
    { id: 'kanji',      label: 'Kanji',      icon: '漢', total: 80,         learned: 0,                           color: '#4a7c59' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '語', total: vocabTotal,  learned: vocabLearned,                color: '#c9a84c' },
    { id: 'grammar',    label: 'Grammar',    icon: '文', total: grammarTotal, learned: completedLessons,           color: '#4a7c59' },
  ]

  return apiOk({
    xp: { total: totalXP, today: todayXP, dailyGoal: DAILY_XP_GOAL, pct: Math.min(100, Math.round(todayXP / DAILY_XP_GOAL * 100)) },
    streak,
    stats: {
      lessonsCompleted: completedLessons,
      totalLessons,
      srsTotal: srsStats._count.id,
      srsDue: srsQueue,
      avgEasiness: Math.round((srsStats._avg.easiness ?? 2.5) * 10) / 10,
    },
    categories,
  })
}
