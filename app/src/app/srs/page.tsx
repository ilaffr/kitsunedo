import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { SRSClient } from './SRSClient'

export default async function SRSPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const now = new Date()
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
    select: { dailyReviewCap: true },
  })
  const cap = settings?.dailyReviewCap ?? 50

  const due = await prisma.sRSItem.findMany({
    where: { userId: session.user.id, nextReview: { lte: now } },
    include: { vocabulary: { select: { word: true, reading: true, meaning: true, exampleSentence: true } } },
    orderBy: [{ consecutiveFailures: 'desc' }, { nextReview: 'asc' }],
    take: cap,
  })

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="md:ml-56 px-4 py-6 pt-20 md:pt-6 pb-24 md:pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-jp text-gold mb-1">Review Queue</h1>
          <p className="text-mist-dark text-sm mb-6">
            {due.length > 0 ? `${due.length} cards due` : 'Nothing due — come back later!'}
          </p>
          <SRSClient cards={due} />
        </div>
      </main>
    </div>
  )
}
