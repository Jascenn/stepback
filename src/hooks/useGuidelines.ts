import { useCallback, useEffect, useState } from 'react'
import type { GuidelinesBundle } from '../types'
import { fetchGuidelines } from '../lib/guidelines'

export function useGuidelines(cached?: GuidelinesBundle, onCache?: (bundle: GuidelinesBundle) => void) {
  const [bundle, setBundle] = useState<GuidelinesBundle | null>(cached ?? null)
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGuidelines(force)
      setBundle(data)
      onCache?.(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [onCache])

  useEffect(() => {
    if (!cached) load()
  }, [cached, load])

  return { bundle, loading, error, reload: () => load(true) }
}