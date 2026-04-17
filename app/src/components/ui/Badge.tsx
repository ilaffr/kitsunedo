import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'locked' | 'available' | 'progress' | 'done'
  className?: string
}

const variants = {
  default:   'bg-gold/10 text-gold border border-gold/30',
  locked:    'bg-ink-light text-mist-dark border border-mist/10',
  available: 'bg-sage/10 text-sage border border-sage/30',
  progress:  'bg-gold/10 text-gold border border-gold/40',
  done:      'bg-sage/20 text-sage border border-sage/40',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
