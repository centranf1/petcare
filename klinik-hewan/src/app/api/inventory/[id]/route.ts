import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const updateSchema = z.object({ namaItem: z.string().optional(), kategori: z.string().optional(), stok: z.number().optional(), satuan: z.string().optional(), harga: z.number().optional(), stokMinimal: z.number().optional() })

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const updated = await prisma.inventory.update({ where: { id: params.id }, data: parsed as any })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: _ as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    await prisma.inventory.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
