import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'

export function useDoctors(): UseQueryResult<any[], Error> {
  return useQuery<any[], Error, any[]>({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await fetch('/api/users?role=DOKTER')
      if (!res.ok) throw new Error('Error fetching doctors')
      const json = await res.json()
      return json.data
    },
  })
}
