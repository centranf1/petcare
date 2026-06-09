"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema } from '@/lib/schemas'

export default function AppointmentForm({ onSubmit, doctors, pets }: { onSubmit: (data: any) => void; doctors?: any[]; pets?: any[] }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(appointmentSchema) })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm">Pilih Hewan</label>
        <select {...register('hewanId')} className="w-full border p-2 rounded">
          <option value="">Pilih hewan</option>
          {pets?.map((p: any) => <option key={p.id} value={p.id}>{p.nama}</option>)}
        </select>
        {errors.hewanId && <p className="text-xs text-red-600">{(errors.hewanId as any).message}</p>}
      </div>
      <div>
        <label className="block text-sm">Pilih Dokter</label>
        <select {...register('dokterId')} className="w-full border p-2 rounded">
          <option value="">Pilih dokter</option>
          {doctors?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {errors.dokterId && <p className="text-xs text-red-600">{(errors.dokterId as any).message}</p>}
      </div>
      <div>
        <label className="block text-sm">Jenis Layanan</label>
        <select {...register('jenis')} className="w-full border p-2 rounded">
          <option value="">Pilih jenis layanan</option>
          <option value="PEMERIKSAAN">Pemeriksaan</option>
          <option value="VAKSINASI">Vaksinasi</option>
          <option value="BEDAH">Bedah</option>
          <option value="GROOMING">Grooming</option>
          <option value="DENTAL">Dental</option>
          <option value="RAWAT_INAP">Rawat Inap</option>
          <option value="TELEMEDICINE">Telemedicine</option>
          <option value="HOME_VISIT">Home Visit</option>
        </select>
        {errors.jenis && <p className="text-xs text-red-600">{(errors.jenis as any).message}</p>}
      </div>
      <div>
        <label className="block text-sm">Tanggal</label>
        <input type="date" {...register('tanggal')} className="w-full border p-2 rounded" />
        {errors.tanggal && <p className="text-xs text-red-600">{(errors.tanggal as any).message}</p>}
      </div>
      <div>
        <label className="block text-sm">Waktu</label>
        <input type="time" {...register('waktu')} className="w-full border p-2 rounded" />
        {errors.waktu && <p className="text-xs text-red-600">{(errors.waktu as any).message}</p>}
      </div>
      <div>
        <label className="block text-sm">Keluhan</label>
        <textarea {...register('keluhan')} className="w-full border p-2 rounded" rows={3} />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Buat Janji</button>
      </div>
    </form>
  )
}
