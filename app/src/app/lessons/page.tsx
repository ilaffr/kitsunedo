import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { LessonCard } from '@/components/lessons/LessonCard'

export default async function LessonsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [lessons, progress] = await Promise.all([
    prisma.lesson.findMany({
      orderBy: [{ course: 'asc' }, { sequenceNumber: 'asc' }],
      select: { id: true, course: true, sequenceNumber: true, title: true, titleJp: true },
    }),
    prisma.userProgress.findMany({
      where: { userId: session.user.id },
      select: { lessonId: true, section: true, completed: true, exercisesCompleted: true },
    }),
  ])

  // Compute status for each lesson
  const progressByLesson = new Map<string, typeof progress>()
  for (const p of progress) {
    const arr = progressByLesson.get(p.lessonId) ?? []
    arr.push(p)
    progressByLesson.set(p.lessonId, arr)
  }

  const lessonStatuses = lessons.map((lesson, idx) => {
    const lp = progressByLesson.get(lesson.id) ?? []
    const isCompleted = lp.some(p => p.completed && p.section === 'EXERCISES')
    const hasProgress = lp.some(p => p.exercisesCompleted > 0)
    // Lock all except first and lessons after a completed one
    const prevCompleted = idx === 0 || lessons.slice(0, idx).some(prev =>
      (progressByLesson.get(prev.id) ?? []).some(p => p.completed && p.section === 'EXERCISES')
    )

    const status: 'locked' | 'available' | 'in-progress' | 'completed' =
      isCompleted ? 'completed'
      : hasProgress ? 'in-progress'
      : prevCompleted ? 'available'
      : 'locked'

    const totalItems = lp.reduce((s, p) => s + p.exercisesCompleted, 0)
    return { ...lesson, status, progressPct: isCompleted ? 100 : Math.min(90, totalItems * 10) }
  })

  const courses = ['N5', 'N4', 'N3', 'N2'] as const
  const byCourse = courses.map(c => ({
    course: c,
    lessons: lessonStatuses.filter(l => l.course === c),
  }))

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="md:ml-56 px-4 py-6 pt-20 md:pt-6 pb-24 md:pb-6 max-w-3xl">
        <h1 className="text-2xl font-jp text-gold mb-6">Lessons</h1>
        {byCourse.map(({ course, lessons: cl }) => (
          <section key={course} className="mb-8">
            <h2 className="text-base font-semibold text-gold-light mb-3 flex items-center gap-2">
              <span>JLPT {course}</span>
              <span className="text-xs text-mist-dark font-normal">
                {cl.filter(l => l.status === 'completed').length}/{cl.length} completed
              </span>
            </h2>
            {cl.length === 0 ? (
              <p className="text-mist-dark text-sm">Coming soon</p>
            ) : (
              <div className="grid gap-2">
                {cl.map(lesson => <LessonCard key={lesson.id} {...lesson} />)}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  )
}
