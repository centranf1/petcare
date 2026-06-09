import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'DOKTER', 'PELANGGAN']).optional(),
  password: z.string().min(6).optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: _ as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'ADMIN' && token.sub !== params.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const user = await prisma.user.findUnique({ where: { id: params.id } })
    if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'ADMIN' && token.sub !== params.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const data: any = { ...parsed }

    if (parsed.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(parsed.password, salt)
    }

    const updated = await prisma.user.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: _ as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
