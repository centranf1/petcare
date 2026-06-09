import React from 'react'
import DashboardShell from '@/components/shared/DashboardShell'

export default function PelangganLayout({ children }: { children: React.ReactNode }) {
  // role hardcoded for now; will be dynamic after session
  return <DashboardShell role="PELANGGAN">{children}</DashboardShell>
}
