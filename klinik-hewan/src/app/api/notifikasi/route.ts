import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const broadcastSchema = z.object({
  target: z.string(),
  judul: z.string(),
  isi: z.string(),
  tipe: z.enum(['INFO', 'PERINGATAN', 'SUKSES']),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    if (!userId) return NextResponse.json({ data: [] })
    const data = await prisma.notifikasi.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = broadcastSchema.parse(body)
    // simple broadcast to all users for demo
    const users = await prisma.user.findMany()
    const creates = users.map((u) => ({ userId: u.id, judul: parsed.judul, isi: parsed.isi, tipe: parsed.tipe }))
    await prisma.notifikasi.createMany({ data: creates })
    return NextResponse.json({ message: 'Broadcast sent' })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
