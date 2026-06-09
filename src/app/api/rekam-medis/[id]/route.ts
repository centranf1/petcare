import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({ keluhan: z.string().optional(), diagnosis: z.string().optional(), tindakan: z.string().optional(), resep: z.string().optional(), catatanDokter: z.string().optional(), lampiran: z.array(z.string()).optional() })

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const item = await prisma.rekamMedis.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const updated = await prisma.rekamMedis.update({ where: { id }, data: parsed as any })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await prisma.rekamMedis.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
