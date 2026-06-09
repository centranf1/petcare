"use client"
import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardShell({ children, role }: { children: React.ReactNode; role: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar role={role} />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
