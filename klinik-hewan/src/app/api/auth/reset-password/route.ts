import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const schema = z.object({ token: z.string(), password: z.string().min(6) })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = schema.parse(body)

    const now = new Date()
    const reset = await prisma.passwordReset.findFirst({ where: { used: false, expiresAt: { gt: now } }, orderBy: { createdAt: 'desc' } })
    if (!reset) return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })

    const match = await bcrypt.compare(token, reset.tokenHash)
    if (!match) return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await prisma.user.update({ where: { id: reset.userId }, data: { password: hash } })
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
