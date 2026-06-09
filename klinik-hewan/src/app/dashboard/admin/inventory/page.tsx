"use client"
import React, { useState } from 'react'
import useInventory from '@/hooks/useInventory'
import { toast } from '@/components/shared/Toast'

export default function AdminInventoryPage() {
  const { query, create, update, remove } = useInventory()
  const items = (query.data as { data: any[] } | undefined)?.data || []
  const [form, setForm] = useState({ namaItem: '', kategori: 'OBAT', stok: 0, satuan: '', harga: 0, stokMinimal: 0 })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await create.mutateAsync(form)
      setForm({ namaItem: '', kategori: 'OBAT', stok: 0, satuan: '', harga: 0, stokMinimal: 0 })
      toast('Item ditambahkan')
    } catch (err: any) {
      toast(err.message || 'Gagal menambah item')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Inventory</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium">Tambah Item</h3>
          <form onSubmit={handleCreate} className="space-y-2 mt-2">
            <input placeholder="Nama Item" value={form.namaItem} onChange={(e) => setForm({ ...form, namaItem: e.target.value })} className="border p-2 rounded w-full" />
            <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="border p-2 rounded w-full">
              <option value="OBAT">Obat</option>
              <option value="ALAT">Alat</option>
              <option value="KONSUMABLE">Konsumable</option>
            </select>
            <input type="number" placeholder="Stok" value={form.stok} onChange={(e) => setForm({ ...form, stok: Number(e.target.value) })} className="border p-2 rounded w-full" />
            <input placeholder="Satuan" value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} className="border p-2 rounded w-full" />
            <input type="number" placeholder="Harga" value={form.harga} onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })} className="border p-2 rounded w-full" />
            <input type="number" placeholder="Stok Minimal" value={form.stokMinimal} onChange={(e) => setForm({ ...form, stokMinimal: Number(e.target.value) })} className="border p-2 rounded w-full" />
            <button className="px-3 py-2 bg-teal-600 text-white rounded">Tambah</button>
          </form>
        </div>

        <div>
          <h3 className="font-medium">Daftar Item</h3>
          <div className="mt-2 space-y-2">
            {query.isLoading && <div>Loading...</div>}
            {items.map((it: any) => (
              <div key={it.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{it.namaItem} ({it.kategori})</div>
                  <div className="text-sm text-gray-600">Stok: {it.stok} • Satuan: {it.satuan}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => {
                    const newStok = Number(prompt('Jumlah stok baru', String(it.stok)) || it.stok)
                    update.mutateAsync({ id: it.id, data: { stok: newStok } }).then(() => toast('Diperbarui')).catch((e) => toast(e.message || 'Gagal'))
                  }} className="px-2 py-1 bg-yellow-600 text-white rounded">Edit</button>
                  <button onClick={() => { if (!confirm('Hapus item?')) return; remove.mutateAsync(it.id).then(() => toast('Dihapus')).catch((e) => toast(e.message || 'Gagal')) }} className="px-2 py-1 bg-red-600 text-white rounded">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
