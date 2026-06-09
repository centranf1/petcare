import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const createSchema = z.object({
  pelangganId: z.string().optional(),
  hewanId: z.string(),
  dokterId: z.string().optional(),
  tanggal: z.string(),
  waktu: z.string(),
  jenis: z.string(),
  keluhan: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '20')
    const pelangganId = url.searchParams.get('pelangganId')
    const dokterId = url.searchParams.get('dokterId')
    const skip = (page - 1) * limit
    const where: any = {}

    if (pelangganId) where.pelangganId = pelangganId
    if (dokterId) where.dokterId = dokterId

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({ where, skip, take: limit, orderBy: { tanggal: 'desc' } }),
      prisma.appointment.count({ where }),
    ])
    return NextResponse.json({ data, meta: { page, limit, total } })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching appointments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = createSchema.parse(body)
    if (!parsed.pelangganId) parsed.pelangganId = token.sub as string
    const appointmentData = { ...parsed, tanggal: new Date(parsed.tanggal) } as any
    const created = await prisma.appointment.create({ data: appointmentData })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
