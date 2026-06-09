"use client"
import React from 'react'

type Column = { key: string; title: string }

export default function DataTable({ columns, data }: { columns: Column[]; data: any[] }) {
  return (
    <div className="bg-white rounded shadow overflow-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left p-2 text-sm text-gray-600">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-teal-50">
              {columns.map((c) => (
                <td key={c.key} className="p-2 text-sm">{row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
