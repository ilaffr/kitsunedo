import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet, CACHE_TTL } from '@/lib/redis'
import { authOptions } from '@/lib/auth'
import { apiOk, apiError } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const cacheKey = `lesson:${params.id}`
  const cached = await cacheGet(cacheKey)
  if (cached) return apiOk(cached)

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: {
      sections: { orderBy: { orderIndex: 'asc' } },
      vocabulary: true,
      grammarPoints: true,
      exercises: true,
    },
  })

  if (!lesson) return apiError('Lesson not found', 404)

  await cacheSet(cacheKey, lesson, CACHE_TTL.lesson)
  return apiOk(lesson)
}
