"use client"
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data: me } = useSWR('/api/users/me', fetcher)
  const userId = me?.user?.id
  const { data } = useSWR(() => (userId ? `/api/notifikasi?userId=${userId}` : null), fetcher)

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="relative">
        🔔
        {data?.data?.filter((n: any) => !n.isRead).length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-2">
          <div className="text-sm font-medium mb-2">Notifikasi</div>
          <div className="space-y-2 max-h-64 overflow-auto">
            {data?.data?.length ? data.data.map((n: any) => (
              <div key={n.id} className={`p-2 rounded ${n.isRead ? 'bg-white' : 'bg-teal-50'}`}>
                <div className="font-semibold">{n.judul}</div>
                <div className="text-xs text-gray-600">{n.isRead ? '' : 'Baru'}</div>
              </div>
            )) : <div className="text-sm text-gray-500 p-2">Tidak ada notifikasi</div>}
          </div>
        </div>
      )}
    </div>
  )
}
