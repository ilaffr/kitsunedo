import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet, CACHE_TTL } from '@/lib/redis'
import { authOptions } from '@/lib/auth'
import { apiOk, apiError } from '@/lib/utils'

const querySchema = z.object({
  course: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).optional(),
  page: z.coerce.number().min(1).default(1),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return apiError('Invalid query')

  const { course, page } = parsed.data
  const cacheKey = `lessons:${course ?? 'all'}:${page}`

  const cached = await cacheGet(cacheKey)
  if (cached) return apiOk(cached)

  const [lessons, total] = await Promise.all([
    prisma.lesson.findMany({
      where: course ? { course } : undefined,
      orderBy: [{ course: 'asc' }, { sequenceNumber: 'asc' }],
      skip: (page - 1) * 20,
      take: 20,
      select: {
        id: true,
        course: true,
        sequenceNumber: true,
        title: true,
        titleJp: true,
        description: true,
      },
    }),
    prisma.lesson.count({ where: course ? { course } : undefined }),
  ])

  const result = { lessons, total, page, pages: Math.ceil(total / 20) }
  await cacheSet(cacheKey, result, CACHE_TTL.lesson)
  return apiOk(result)
}
