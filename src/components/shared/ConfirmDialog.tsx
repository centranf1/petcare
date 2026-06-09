"use client"
import React from 'react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title?: string; message?: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-semibold">{title || 'Konfirmasi'}</h3>
        <p className="mt-2 text-sm text-gray-600">{message || 'Yakin ingin melanjutkan?'}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Batal</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-teal-600 text-white rounded">Konfirmasi</button>
        </div>
      </div>
    </div>
  )
}
