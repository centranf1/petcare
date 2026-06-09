import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ user: { id: (token as any).id, name: (token as any).name, email: (token as any).email, role: (token as any).role, avatar: (token as any).avatar } })
}
