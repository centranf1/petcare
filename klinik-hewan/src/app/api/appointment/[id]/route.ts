import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getToken } from 'next-auth/jwt'

const updateSchema = z.object({ dokterId: z.string().nullable().optional(), status: z.string().optional(), catatanAdmin: z.string().optional() })

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const item = await prisma.appointment.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = updateSchema.parse(body)
    // allow DOKTER or ADMIN to update appointment
    if (token.role !== 'DOKTER' && token.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const updated = await prisma.appointment.update({ where: { id }, data: parsed as any })

    // publish queue update via SSE
    try {
      const { sseService } = await import('@/lib/sse')
      sseService.publish({ type: 'queue:update', payload: updated })
    } catch (e) {}

    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // allow ADMIN or owner (pelanggan)
    const appt = await prisma.appointment.findUnique({ where: { id } })
    if (!appt) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    if (token.role !== 'ADMIN' && token.sub !== appt.pelangganId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    await prisma.appointment.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
