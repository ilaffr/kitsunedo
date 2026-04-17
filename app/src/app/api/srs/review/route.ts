import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { cacheDel } from '@/lib/redis'
import { authOptions } from '@/lib/auth'
import { apiOk, apiError } from '@/lib/utils'

const reviewSchema = z.object({
  itemId: z.string(),
  quality: z.number().int().min(0).max(5),
})

// SM-2 algorithm
function calculateNextReview(item: {
  easiness: number
  interval: number
  repetitions: number
  consecutiveFailures: number
}, quality: number) {
  let { easiness, interval, repetitions } = item
  const consecutiveFailures = quality < 3 ? item.consecutiveFailures + 1 : 0

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easiness)

    easiness = Math.max(1.3, easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    repetitions += 1
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return { easiness, interval, repetitions, consecutiveFailures, nextReview }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body = await req.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message)

  const { itemId, quality } = parsed.data

  const item = await prisma.sRSItem.findFirst({
    where: { id: itemId, userId: session.user.id },
  })
  if (!item) return apiError('SRS item not found', 404)

  const updates = calculateNextReview(item, quality)

  const updated = await prisma.sRSItem.update({
    where: { id: itemId },
    data: { ...updates, lastReviewed: new Date() },
  })

  await cacheDel(`srs:queue:${session.user.id}`)
  return apiOk(updated)
}
