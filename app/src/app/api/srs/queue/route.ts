import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet, CACHE_TTL } from '@/lib/redis'
import { authOptions } from '@/lib/auth'
import { apiOk, apiError } from '@/lib/utils'

const LEECH_THRESHOLD = 4

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const cacheKey = `srs:queue:${session.user.id}`
  const cached = await cacheGet(cacheKey)
  if (cached) return apiOk(cached)

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
    select: { dailyReviewCap: true },
  })
  const dailyCap = settings?.dailyReviewCap ?? 50

  const now = new Date()
  const due = await prisma.sRSItem.findMany({
    where: { userId: session.user.id, nextReview: { lte: now } },
    include: { vocabulary: true },
    orderBy: { nextReview: 'asc' },
  })

  // 4-tier prioritization: leeches → overdue → new → regular
  const leeches = due.filter((i) => i.consecutiveFailures >= LEECH_THRESHOLD)
  const overdue = due.filter(
    (i) => i.consecutiveFailures < LEECH_THRESHOLD && i.repetitions > 0 &&
    (now.getTime() - i.nextReview.getTime()) > 24 * 60 * 60 * 1000
  )
  const newItems = due.filter((i) => i.repetitions === 0 && i.consecutiveFailures < LEECH_THRESHOLD)
  const regular = due.filter(
    (i) => i.repetitions > 0 && i.consecutiveFailures < LEECH_THRESHOLD &&
    (now.getTime() - i.nextReview.getTime()) <= 24 * 60 * 60 * 1000
  )

  const queue = [...leeches, ...overdue, ...newItems, ...regular].slice(0, dailyCap)

  await cacheSet(cacheKey, queue, CACHE_TTL.srsQueue)
  return apiOk(queue)
}
