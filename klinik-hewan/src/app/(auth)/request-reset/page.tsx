"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from '@/components/shared/Toast'

const schema = z.object({ email: z.string().email() })
type FormData = z.infer<typeof schema>

export default function RequestResetPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Gagal mengirim email')
      toast('Permintaan reset password dikirim, periksa email Anda.')
    } catch (err: any) {
      toast(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Reset Password</h2>
        <p className="text-sm text-slate-600 mb-4">Masukkan email Anda untuk menerima tautan reset password.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input className="mt-1 block w-full border rounded p-2" {...register('email')} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-teal-600 text-white rounded disabled:opacity-50">
            {loading ? 'Mengirim...' : 'Kirim tautan reset'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          <Link href="/login" className="text-teal-600 hover:underline">Kembali ke Login</Link>
        </div>
      </div>
    </div>
  )
}
