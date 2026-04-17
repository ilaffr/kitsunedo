'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Registration failed')
    } else {
      router.push('/login?registered=1')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-jp text-gold text-center mb-8">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-mist-dark text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-ink-light border border-gold/30 text-mist rounded px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-mist-dark text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]+"
              className="w-full bg-ink-light border border-gold/30 text-mist rounded px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-mist-dark text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-ink-light border border-gold/30 text-mist rounded px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-fox text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-ink py-2 rounded font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Register Free'}
          </button>
        </form>
        <p className="text-center text-mist-dark text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
