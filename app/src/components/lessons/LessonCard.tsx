import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed'

interface LessonCardProps {
  id: string
  course: string
  sequenceNumber: number
  title: string
  titleJp?: string | null
  status: LessonStatus
  progressPct?: number
}

const statusConfig: Record<LessonStatus, { badge: string; variant: 'locked' | 'available' | 'progress' | 'done'; icon: string; border: string }> = {
  locked:      { badge: 'Locked',      variant: 'locked',    icon: '🔒', border: 'border-mist/10 opacity-60' },
  available:   { badge: 'Available',   variant: 'available', icon: '▶',  border: 'border-sage/30 hover:border-sage/60' },
  'in-progress': { badge: 'In Progress', variant: 'progress', icon: '⚡', border: 'border-gold/40 hover:border-gold/70' },
  completed:   { badge: 'Completed',   variant: 'done',      icon: '✓',  border: 'border-sage/40 hover:border-sage/60' },
}

export function LessonCard({ id, course, sequenceNumber, title, titleJp, status, progressPct = 0 }: LessonCardProps) {
  const cfg = statusConfig[status]
  const isLocked = status === 'locked'

  const content = (
    <div className={cn(
      'bg-ink-light border rounded-xl p-4 transition-colors',
      cfg.border,
      !isLocked && 'cursor-pointer'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-mist-dark text-xs">{course}-{sequenceNumber}</span>
            <Badge variant={cfg.variant}>{cfg.badge}</Badge>
          </div>
          <div className="text-mist font-medium truncate">{title}</div>
          {titleJp && <div className="text-gold/60 text-sm font-jp mt-0.5">{titleJp}</div>}
        </div>
        <span className={cn('text-xl flex-shrink-0', status === 'completed' ? 'text-sage' : status === 'in-progress' ? 'text-gold' : 'text-mist-dark')}>
          {cfg.icon}
        </span>
      </div>
      {status === 'in-progress' && progressPct > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-mist-dark mb-1">
            <span>Progress</span><span>{progressPct}%</span>
          </div>
          <div className="w-full bg-ink rounded-full h-1.5">
            <div className="bg-gold h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}
    </div>
  )

  if (isLocked) return content
  return <Link href={`/lessons/${id}`}>{content}</Link>
}
