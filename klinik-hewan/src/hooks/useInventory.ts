import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useInventory = () => {
  const qc = useQueryClient()
  const key = ['inventory']

  const query = useQuery<{ data: any[] }, Error>({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch('/api/inventory')
      if (!res.ok) throw new Error('Gagal fetch inventory')
      return res.json()
    },
  })

  const create = useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Gagal menambah item')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const update = useMutation<any, Error, { id: string; data: any }>({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Gagal update')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal hapus')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return { query, create, update, remove }
}

export default useInventory
