import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useUsers = (role?: string) => {
  const qc = useQueryClient()
  const key = ['users', role]

  const query = useQuery<{ data: any[] }, Error>({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(`/api/users${role ? `?role=${role}` : ''}`)
      if (!res.ok) throw new Error('Gagal fetch users')
      return res.json()
    },
  })

  const create = useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error('Gagal membuat user')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return { query, create, remove }
}

export default useUsers
