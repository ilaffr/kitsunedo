'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⛩' },
  { href: '/lessons',   label: 'Lessons',   icon: '📖' },
  { href: '/srs',       label: 'Review',    icon: '🎴' },
  { href: '/exams',     label: 'Exams',     icon: '📝' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-ink-light border-r border-gold/10 px-4 py-6 z-40">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-jp text-gold">狐道</span>
          <span className="text-mist text-sm font-semibold">KitsuneDo</span>
        </Link>

        <div className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname?.startsWith(item.href)
                  ? 'bg-gold/10 text-gold'
                  : 'text-mist-dark hover:text-mist hover:bg-ink'
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {session && (
          <div className="border-t border-gold/10 pt-4">
            <p className="text-mist-dark text-xs mb-2 px-2">@{session.user.name}</p>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-mist-dark hover:text-fox text-xs px-3 py-1.5 w-full text-left"
            >
              Sign out
            </button>
          </div>
        )}
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-ink-light border-b border-gold/10 flex items-center justify-between px-4 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-jp text-gold">狐道</span>
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-mist p-1">
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-ink-light border-b border-gold/10 z-40 px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                pathname?.startsWith(item.href) ? 'bg-gold/10 text-gold' : 'text-mist-dark'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-ink-light border-t border-gold/10 flex items-center justify-around z-40">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 text-xs font-medium py-1 px-3',
              pathname?.startsWith(item.href) ? 'text-gold' : 'text-mist-dark'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
