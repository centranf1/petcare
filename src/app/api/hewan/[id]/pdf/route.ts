import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateHewanCardDocument, createPdfBufferFromDocument } from '@/lib/pdf'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const hewan = await prisma.hewan.findUnique({ where: { id }, include: { pelanggan: true } })
    if (!hewan) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    const doc = generateHewanCardDocument(hewan, hewan.pelanggan)
    const buffer = await createPdfBufferFromDocument(doc)
    return new Response(buffer, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="kartu-${hewan.nama}.pdf"` } })
  } catch (err) {
    return NextResponse.json({ message: 'Error generating PDF' }, { status: 500 })
  }
}
