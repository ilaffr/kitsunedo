import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { redis } from './redis'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const AUTH_RATE_LIMIT = 5
const AUTH_WINDOW_SECONDS = 15 * 60

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const ip = req.headers?.['x-forwarded-for'] ?? 'unknown'
        const rateLimitKey = `auth:rate:${ip}`
        const attempts = await redis.incr(rateLimitKey)
        if (attempts === 1) await redis.expire(rateLimitKey, AUTH_WINDOW_SECONDS)
        if (attempts > AUTH_RATE_LIMIT) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, username: true, passwordHash: true },
        })
        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        await redis.del(rateLimitKey)
        return { id: user.id, email: user.email, name: user.username }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
}
