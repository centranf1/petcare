import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function DashboardRootPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const role = (session.user as any)?.role as string | undefined
  if (role === 'ADMIN') redirect('/dashboard/admin')
  if (role === 'DOKTER') redirect('/dashboard/dokter')
  redirect('/dashboard/pelanggan')
}
