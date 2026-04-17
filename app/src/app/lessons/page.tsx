import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function LessonsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const lessons = await prisma.lesson.findMany({
    orderBy: [{ course: 'asc' }, { sequenceNumber: 'asc' }],
    select: { id: true, course: true, sequenceNumber: true, title: true, titleJp: true },
    take: 20,
  })

  const courses = ['N5', 'N4', 'N3', 'N2'] as const
  const byCourse = Object.fromEntries(
    courses.map((c) => [c, lessons.filter((l) => l.course === c)])
  )

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-jp text-gold mb-8">Lessons</h1>
      {courses.map((course) => (
        <section key={course} className="mb-8">
          <h2 className="text-xl text-gold-light mb-4 font-jp">JLPT {course}</h2>
          {byCourse[course].length === 0 ? (
            <p className="text-mist-dark text-sm">Coming soon</p>
          ) : (
            <div className="grid gap-3">
              {byCourse[course].map((lesson) => (
                <a
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="block bg-ink-light border border-gold/20 rounded p-4 hover:border-gold/60 transition-colors"
                >
                  <span className="text-mist-dark text-xs mr-2">{lesson.course}-{lesson.sequenceNumber}</span>
                  <span className="text-mist">{lesson.title}</span>
                  {lesson.titleJp && (
                    <span className="text-gold/60 text-sm ml-2 font-jp">{lesson.titleJp}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  )
}
