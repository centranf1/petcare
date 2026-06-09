"use client"
import React, { useState } from 'react'
import useUsers from '@/hooks/useUsers'
import { toast } from '@/components/shared/Toast'

export default function AdminUsersPage() {
  const { query, create, remove } = useUsers()
  const users = (query.data as { data: any[] } | undefined)?.data || []
  const [form, setForm] = useState({ name: '', email: '', role: 'PELANGGAN', password: '' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await create.mutateAsync(form)
      setForm({ name: '', email: '', role: 'PELANGGAN', password: '' })
      toast('Pengguna dibuat')
    } catch (err: any) {
      toast(err.message || 'Gagal membuat pengguna')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Manajemen Pengguna</h2>
      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium">Tambah Pengguna</h3>
          <form onSubmit={handleCreate} className="space-y-2 mt-2">
            <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded w-full" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border p-2 rounded w-full">
              <option value="PELANGGAN">Pelanggan</option>
              <option value="DOKTER">Dokter</option>
              <option value="ADMIN">Admin</option>
            </select>
            <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 rounded w-full" />
            <button className="px-3 py-2 bg-teal-600 text-white rounded">Buat</button>
          </form>
        </div>

        <div>
          <h3 className="font-medium">Daftar Pengguna</h3>
          <div className="mt-2 space-y-2">
            {query.isLoading && <div>Loading...</div>}
            {users.map((u: any) => (
              <div key={u.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{u.name} ({u.role})</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
                <div>
                  <button onClick={() => {
                    if (!confirm('Hapus pengguna ini?')) return
                    remove.mutateAsync(u.id).then(() => toast('Pengguna dihapus')).catch((e) => toast(e.message || 'Gagal menghapus'))
                  }} className="px-2 py-1 bg-red-600 text-white rounded">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
