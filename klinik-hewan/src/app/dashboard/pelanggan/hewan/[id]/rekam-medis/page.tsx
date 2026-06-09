import React from 'react'
import prisma from '@/lib/prisma'
import RekamMedisClient from '@/components/pelanggan/RekamMedisClient'

export default async function RekamMedisPage({ params }: { params: { id: string } }) {
  const hewan = await prisma.hewan.findUnique({ where: { id: params.id }, include: { pelanggan: true } })
  if (!hewan) return <div>Not found</div>

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Rekam Medis - {hewan.nama}</h2>
      <div className="mt-4">
        <RekamMedisClient hewanId={hewan.id} />
      </div>
    </div>
  )
}
