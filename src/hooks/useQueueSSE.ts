import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function useQueueSSE() {
  const qc = useQueryClient()
  useEffect(() => {
    const es = new EventSource('/api/konsultasi/sse?userId=global')
    es.addEventListener('queue:update', (e: any) => {
      try {
        const payload = JSON.parse(e.data)
        qc.invalidateQueries({ queryKey: ['appointment'] })
      } catch (err) {}
    })
    return () => es.close()
  }, [qc])
}
