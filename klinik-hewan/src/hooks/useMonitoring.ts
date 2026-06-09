import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const fetchMonitoring = async (hewanId: string) => {
  const res = await fetch(`/api/monitoring?hewanId=${hewanId}`)
  if (!res.ok) throw new Error('Error fetching monitoring')
  return res.json()
}

export function useMonitoring(hewanId?: string) {
  return useQuery({
    queryKey: ['monitoring', hewanId],
    queryFn: () => fetchMonitoring(hewanId || ''),
    enabled: !!hewanId,
  })
}

export function useCreateMonitoring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/monitoring', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Error creating monitoring')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['monitoring'] }),
  })
}
