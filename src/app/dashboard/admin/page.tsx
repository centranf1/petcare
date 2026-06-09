import DashboardShell from '@/components/shared/DashboardShell'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  const [pelangganCount, dokterCount, hewanCount, appointmentCount] = await Promise.all([
    prisma.user.count({ where: { role: 'PELANGGAN' } }),
    prisma.user.count({ where: { role: 'DOKTER' } }),
    prisma.hewan.count(),
    prisma.appointment.count(),
  ])

  return (
    <DashboardShell role="ADMIN">
      <div>
        <h2 className="text-2xl font-semibold text-teal-700">Admin Dashboard</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">Total Pelanggan: {pelangganCount}</div>
          <div className="p-4 bg-white rounded shadow">Total Dokter: {dokterCount}</div>
          <div className="p-4 bg-white rounded shadow">Total Janji: {appointmentCount}</div>
        </div>
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Hewan Terdaftar</h3>
          <div className="mt-3">Total hewan: {hewanCount}</div>
        </div>
      </div>
    </DashboardShell>
  )
}
