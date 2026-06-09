import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useRekamMedis = (hewanId?: string) => {
  const qc = useQueryClient()
  const key = ['rekam-medis', hewanId]

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(`/api/rekam-medis?hewanId=${hewanId || ''}`)
      if (!res.ok) throw new Error('Gagal fetch rekam medis')
      return res.json()
    },
    enabled: !!hewanId,
  })

  const create = useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/rekam-medis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal membuat rekam medis')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const update = useMutation<any, Error, { id: string; data: any }>({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/rekam-medis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Gagal mengupdate rekam medis')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rekam-medis/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus rekam medis')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const downloadPdf = async (id: string) => {
    const res = await fetch(`/api/rekam-medis/${id}/pdf`)
    if (!res.ok) throw new Error('Gagal mengunduh PDF')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rekam-medis-${id}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return { query, create, update, remove, downloadPdf }
}

export default useRekamMedis
