import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

const fetchHewan = async (page = 1, limit = 10, pelangganId?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (pelangganId) params.set('pelangganId', pelangganId)
  const res = await fetch(`/api/hewan?${params.toString()}`)
  if (!res.ok) throw new Error('Error fetching')
  return res.json()
}

export function useHewan(page = 1, limit = 10, pelangganId?: string): UseQueryResult<{ data: any[] }, Error> {
  return useQuery<{ data: any[] }, Error>({
    queryKey: ['hewan', page, limit, pelangganId],
    queryFn: () => fetchHewan(page, limit, pelangganId),
  })
}

export function useCreateHewan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/hewan', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Error creating hewan')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hewan'] }),
  })
}
