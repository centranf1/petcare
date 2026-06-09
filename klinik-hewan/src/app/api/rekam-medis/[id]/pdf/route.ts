import prisma from '@/lib/prisma'
import { generateRekamMedisDocument, createPdfBufferFromDocument } from '@/lib/pdf'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const rekam = await prisma.rekamMedis.findUnique({ where: { id }, include: { dokter: true, hewan: true } })
  if (!rekam) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })

  const doc = generateRekamMedisDocument(rekam)
  const buffer = await createPdfBufferFromDocument(doc)

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rekam-${rekam.id}.pdf"`,
    },
  })
}
