import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const createSchema = z.object({
  appointmentId: z.string(),
  hewanId: z.string(),
  dokterId: z.string(),
  tanggalPeriksa: z.string(),
  keluhan: z.string().optional(),
  diagnosis: z.string().optional(),
  tindakan: z.string().optional(),
  resep: z.string().optional(),
  catatanDokter: z.string().optional(),
  lampiran: z.array(z.string()).optional(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const hewanId = url.searchParams.get('hewanId') || undefined
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    if (hewanId) {
      const [data, total] = await Promise.all([
        prisma.rekamMedis.findMany({ where: { hewanId }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        prisma.rekamMedis.count({ where: { hewanId } }),
      ])
      return NextResponse.json({ data, meta: { page, limit, total } })
    }

    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    if (token.role === 'ADMIN') {
      const [data, total] = await Promise.all([
        prisma.rekamMedis.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
        prisma.rekamMedis.count(),
      ])
      return NextResponse.json({ data, meta: { page, limit, total } })
    }
    if (token.role === 'DOKTER') {
      const [data, total] = await Promise.all([
        prisma.rekamMedis.findMany({ where: { dokterId: token.sub as string }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        prisma.rekamMedis.count({ where: { dokterId: token.sub as string } }),
      ])
      return NextResponse.json({ data, meta: { page, limit, total } })
    }

    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching rekam medis' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    if (token.role !== 'DOKTER' && token.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = createSchema.parse(body)
    // enforce dokterId from token for DOKTER role
    if (token.role === 'DOKTER') parsed.dokterId = token.sub as string
    const created = await prisma.rekamMedis.create({ data: { ...parsed, tanggalPeriksa: new Date(parsed.tanggalPeriksa) } })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
