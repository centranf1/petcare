"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { hewanSchema } from '@/lib/schemas'

export default function HewanForm({ onSubmit, defaultValues }: { onSubmit: (data: any) => void; defaultValues?: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues, resolver: zodResolver(hewanSchema) })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm">Nama</label>
        <input {...register('nama')} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm">Jenis</label>
        <select {...register('jenis')} className="w-full border p-2 rounded">
          <option value="KUCING">Kucing</option>
          <option value="ANJING">Anjing</option>
          <option value="BURUNG">Burung</option>
          <option value="KELINCI">Kelinci</option>
          <option value="LAINNYA">Lainnya</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Ras</label>
        <input {...register('ras')} className="w-full border p-2 rounded" />
        {errors.ras && <p className="text-xs text-red-600">{(errors.ras as any).message}</p>}
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Simpan</button>
      </div>
    </form>
  )
}
