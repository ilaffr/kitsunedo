import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { XPStreakCard } from '@/components/dashboard/XPStreakCard'
import { CategoryGrid } from '@/components/dashboard/CategoryGrid'
import { SRSDueCard } from '@/components/dashboard/SRSDueCard'
import { StatsCard } from '@/components/ui/StatsCard'
import { prisma } from '@/lib/prisma'

async function getDashboardData(userId: string) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [allProgress, srsStats, totalLessons, srsDue, vocabTotal, grammarTotal] = await Promise.all([
    prisma.userProgress.findMany({ where: { userId } }),
    prisma.sRSItem.aggregate({ where: { userId }, _count: { id: true } }),
    prisma.lesson.count(),
    prisma.sRSItem.count({ where: { userId, nextReview: { lte: now } } }),
    prisma.vocabulary.count(),
    prisma.grammarPoint.count(),
  ])

  const completedLessons = new Set(
    allProgress.filter(p => p.completed && p.section === 'EXERCISES').map(p => p.lessonId)
  ).size
  const vocabLearned = await prisma.sRSItem.count({ where: { userId, repetitions: { gte: 1 } } })

  const DAILY_GOAL = 100
  const XP_PER_EXERCISE = 10
  const XP_PER_LESSON = 50

  const totalXP = allProgress.reduce((s, p) => s + p.exercisesCompleted * XP_PER_EXERCISE, 0)
    + completedLessons * XP_PER_LESSON
  const todayXP = allProgress
    .filter(p => p.updatedAt >= todayStart)
    .reduce((s, p) => s + p.exercisesCompleted * XP_PER_EXERCISE, 0)
  const pct = Math.min(100, Math.round(todayXP / DAILY_GOAL * 100))

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

  const categories = [
    { id: 'hiragana',   label: 'Hiragana',   icon: 'あ', total: 46,          learned: Math.min(vocabLearned, 46), color: '#c9a84c' },
    { id: 'katakana',   label: 'Katakana',   icon: 'ア', total: 46,          learned: 0,                          color: '#d4522a' },
    { id: 'kanji',      label: 'Kanji',      icon: '漢', total: 80,          learned: 0,                          color: '#4a7c59' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '語', total: vocabTotal,   learned: vocabLearned,               color: '#c9a84c' },
    { id: 'grammar',    label: 'Grammar',    icon: '文', total: grammarTotal, learned: completedLessons,           color: '#4a7c59' },
  ]

  return { xp: { total: totalXP, today: todayXP, dailyGoal: DAILY_GOAL, pct }, streak, srsDue, completedLessons, totalLessons, srsTotal: srsStats._count.id, categories }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const data = await getDashboardData(session.user.id)

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="md:ml-56 px-4 py-6 pt-20 md:pt-6 pb-24 md:pb-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-jp text-gold">おかえり, {session.user.name}</h1>
          <p className="text-mist-dark text-sm mt-1">Keep up your streak — consistency beats intensity.</p>
        </div>

        <div className="grid gap-4 mb-6">
          <XPStreakCard
            todayXP={data.xp.today}
            dailyGoal={data.xp.dailyGoal}
            pct={data.xp.pct}
            streak={data.streak}
            totalXP={data.xp.total}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatsCard label="Lessons done" value={data.completedLessons} sub={`of ${data.totalLessons}`} icon="📖" accent="gold" />
          <StatsCard label="Cards learned" value={data.srsTotal} icon="🃏" accent="sage" />
          <StatsCard label="Due today" value={data.srsDue} icon="⏰" accent={data.srsDue > 0 ? 'fox' : 'sage'} />
          <StatsCard label="Day streak" value={`${data.streak}🔥`} icon="" accent="fox" />
        </div>

        {/* SRS due banner */}
        {data.srsDue > 0 && (
          <div className="mb-6">
            <SRSDueCard due={data.srsDue} />
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <CategoryGrid categories={data.categories} />
        </div>
      </main>
    </div>
  )
}
