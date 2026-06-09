import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const createSchema = z.object({
  nama: z.string(),
  jenis: z.string(),
  ras: z.string().optional(),
  tanggalLahir: z.string().optional(),
  beratBadan: z.number().optional(),
  foto: z.string().optional(),
  catatanKhusus: z.string().optional(),
  pelangganId: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '10')
    const pelangganId = url.searchParams.get('pelangganId')
    const skip = (page - 1) * limit
    const where = pelangganId ? { pelangganId } : undefined
    const [data, count] = await Promise.all([
      prisma.hewan.findMany({ where, skip, take: limit }),
      pelangganId ? prisma.hewan.count({ where }) : prisma.hewan.count(),
    ])
    return NextResponse.json({ data, meta: { page, limit, total: count } })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching hewan' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = createSchema.parse(body)
    if (!parsed.pelangganId) parsed.pelangganId = token.sub as string
    const created = await prisma.hewan.create({ data: parsed as any })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
