import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  nama: z.string().optional(),
  ras: z.string().optional(),
  tanggalLahir: z.string().optional(),
  beratBadan: z.number().optional(),
  foto: z.string().optional(),
  catatanKhusus: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const hewan = await prisma.hewan.findUnique({ where: { id } })
    if (!hewan) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(hewan)
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const updated = await prisma.hewan.update({ where: { id }, data: parsed as any })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await prisma.hewan.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
