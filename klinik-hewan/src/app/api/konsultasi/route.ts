import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  appointmentId: z.string().optional(),
  isi: z.string(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const appointmentId = url.searchParams.get('appointmentId')
    const senderId = url.searchParams.get('senderId')
    const where: any = {}
    if (appointmentId) where.appointmentId = appointmentId
    if (senderId) where.OR = [{ senderId }, { receiverId: senderId }]
    const data = await prisma.pesan.findMany({ where, orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = createSchema.parse(body)
    const created = await prisma.pesan.create({ data: parsed as any })

    // publish via SSE
    try {
      const { sseService } = await import('../../../lib/sse')
      sseService.publish({ type: `message:${parsed.receiverId}`, payload: created })
      sseService.publish({ type: `message:global`, payload: created })
    } catch (e) {
      // ignore
    }

    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
