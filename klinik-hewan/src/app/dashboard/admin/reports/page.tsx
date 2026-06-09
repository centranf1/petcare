"use client"
import React from 'react'

export default function AdminReportsPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Laporan</h2>
      <div className="mt-4 space-y-3">
        <div className="flex items-center space-x-2">
          <a className="px-3 py-2 bg-blue-600 text-white rounded" href={`/api/reports/appointments?format=pdf`}>Unduh Laporan Janji (PDF)</a>
          <a className="px-3 py-2 bg-green-600 text-white rounded" href={`/api/reports/appointments?format=xlsx`}>Unduh Data Janji (XLSX)</a>
        </div>
        <div className="flex items-center space-x-2">
          <a className="px-3 py-2 bg-indigo-600 text-white rounded" href={`/api/inventory/export`}>Unduh Inventory (CSV)</a>
          <a className="px-3 py-2 bg-indigo-800 text-white rounded" href={`/api/reports/inventory/xlsx`}>Unduh Inventory (XLSX)</a>
        </div>
      </div>
    </div>
  )
}
