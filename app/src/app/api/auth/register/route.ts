import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { apiOk, apiError } from '@/lib/utils'

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.errors[0].message)

  const { email, username, password } = parsed.data

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  })
  if (existing?.email === email) return apiError('Email already registered')
  if (existing?.username === username) return apiError('Username already taken')

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      settings: { create: {} },
    },
    select: { id: true, email: true, username: true },
  })

  return apiOk(user, 201)
}
