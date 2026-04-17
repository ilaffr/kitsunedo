import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

export const CACHE_TTL = {
  lesson: 60 * 60 * 24,       // 24h
  vocabulary: 60 * 60 * 24,   // 24h
  srsQueue: 60 * 5,            // 5min
  userProgress: 60 * 5,        // 5min
  examResults: 60 * 60,        // 1h
} as const

export async function cacheGet<T>(key: string): Promise<T | null> {
  const val = await redis.get(key)
  return val ? (JSON.parse(val) as T) : null
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
}

export async function cacheDel(key: string): Promise<void> {
  await redis.del(key)
}
