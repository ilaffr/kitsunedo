import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

export async function GET() {
  const checks = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    redis.ping(),
  ])

  const db = checks[0].status === 'fulfilled'
  const cache = checks[1].status === 'fulfilled'
  const healthy = db && cache

  return Response.json(
    { status: healthy ? 'ok' : 'degraded', db, cache, ts: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  )
}
