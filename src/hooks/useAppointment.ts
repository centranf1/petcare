import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const fetchAppointments = async (page = 1, limit = 20, pelangganId?: string, dokterId?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (pelangganId) params.set('pelangganId', pelangganId)
  if (dokterId) params.set('dokterId', dokterId)
  const res = await fetch(`/api/appointment?${params.toString()}`)
  if (!res.ok) throw new Error('Error fetching appointments')
  return res.json()
}

export function useAppointment({ page = 1, limit = 20, pelangganId, dokterId }: { page?: number; limit?: number; pelangganId?: string; dokterId?: string } = {}) {
  return useQuery({
    queryKey: ['appointment', page, limit, pelangganId, dokterId],
    queryFn: () => fetchAppointments(page, limit, pelangganId, dokterId),
  })
}

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/appointment', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Error creating appointment')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointment'] }),
  })
}
