import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-jp text-gold mb-4">狐道</h1>
        <p className="text-2xl text-mist mb-2">KitsuneDo</p>
        <p className="text-mist-dark mb-10">
          Master Japanese & Korean through structured lessons, intelligent SRS, and real content.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-gold text-ink px-6 py-3 rounded font-semibold hover:bg-gold-light transition-colors"
          >
            Start Learning Free
          </Link>
          <Link
            href="/login"
            className="border border-gold text-gold px-6 py-3 rounded font-semibold hover:bg-gold/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
