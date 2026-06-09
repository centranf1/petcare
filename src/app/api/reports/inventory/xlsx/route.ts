import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const items = await prisma.inventory.findMany()
    const wsData = [
      ['Nama Item','Kategori','Stok','Satuan','Harga','Stok Minimal'],
      ...items.map(i => [i.namaItem, i.kategori, i.stok, i.satuan, i.harga, i.stokMinimal])
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
    return new Response(buf, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="inventory.xlsx"' } })
  } catch (err) {
    return NextResponse.json({ message: 'Error exporting xlsx' }, { status: 500 })
  }
}
