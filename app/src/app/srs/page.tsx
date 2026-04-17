import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function SRSPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-jp text-gold mb-2">Review Queue</h1>
      <p className="text-mist-dark mb-8">Spaced repetition flashcard review</p>
      {/* SRS review client component will be added via /feature */}
      <div className="bg-ink-light border border-gold/20 rounded p-8 text-center">
        <p className="text-mist-dark">Loading your review queue…</p>
      </div>
    </main>
  )
}
