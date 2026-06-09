import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({ beratBadan: z.number().optional(), suhu: z.number().optional(), nafsuMakan: z.string().optional(), aktivitas: z.string().optional(), catatanGejala: z.string().optional() })

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const item = await prisma.monitoringHarian.findUnique({ where: { id } })
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
    const updated = await prisma.monitoringHarian.update({ where: { id }, data: parsed as any })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await prisma.monitoringHarian.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
