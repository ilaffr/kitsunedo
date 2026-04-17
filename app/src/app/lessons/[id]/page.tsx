import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function LessonPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: {
      sections: { orderBy: { orderIndex: 'asc' } },
      vocabulary: true,
      grammarPoints: true,
      exercises: { take: 5 },
    },
  })

  if (!lesson) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-mist-dark text-sm">{lesson.course} · Lesson {lesson.sequenceNumber}</span>
        <h1 className="text-3xl font-jp text-gold mt-1">{lesson.title}</h1>
        {lesson.titleJp && <p className="text-gold/60 font-jp mt-1">{lesson.titleJp}</p>}
        {lesson.description && <p className="text-mist-dark mt-3">{lesson.description}</p>}
      </div>

      {lesson.vocabulary.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl text-gold-light mb-4 font-jp">Vocabulary</h2>
          <div className="grid gap-2">
            {lesson.vocabulary.map((v) => (
              <div key={v.id} className="bg-ink-light border border-gold/20 rounded p-3 flex justify-between">
                <div>
                  <span className="text-mist font-jp text-lg">{v.word}</span>
                  <span className="text-mist-dark ml-2 text-sm font-jp">({v.reading})</span>
                </div>
                <span className="text-gold/80 text-sm">{v.meaning}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {lesson.grammarPoints.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl text-gold-light mb-4 font-jp">Grammar</h2>
          <div className="grid gap-4">
            {lesson.grammarPoints.map((g) => (
              <div key={g.id} className="bg-ink-light border border-gold/20 rounded p-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gold font-jp">{g.name}</span>
                  {g.nameJp && <span className="text-gold/60 font-jp text-sm">{g.nameJp}</span>}
                </div>
                <p className="text-mist text-sm">{g.meaning}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
