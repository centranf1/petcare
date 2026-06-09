import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  hewanId: z.string(),
  tanggal: z.string(),
  beratBadan: z.number().optional(),
  suhu: z.number().optional(),
  nafsuMakan: z.string(),
  aktivitas: z.string(),
  catatanGejala: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const hewanId = url.searchParams.get('hewanId')
    const where: any = {}
    if (hewanId) where.hewanId = hewanId
    const data = await prisma.monitoringHarian.findMany({ where, orderBy: { tanggal: 'asc' } })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching monitoring' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = createSchema.parse(body)
    const created = await prisma.monitoringHarian.create({ data: { ...parsed, tanggal: new Date(parsed.tanggal) } as any })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
