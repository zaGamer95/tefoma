import { useEffect, useState } from 'react'

interface JsonState<T> {
  data: T[] | null
  error: string | null
}

/**
 * public/data/ 의 JSON을 런타임에 가져온다.
 *
 * 반드시 import.meta.env.BASE_URL 을 앞에 붙일 것. 배포 주소가
 * https://wonbo.site/tefoma/ 이므로 '/data/...' 같은 루트 절대경로는
 * 404가 난다. (프로젝트 규칙 3번)
 */
export function useJson<T>(file: string): JsonState<T> {
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.BASE_URL}data/${file}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((json: T[]) => {
        if (!cancelled) setData(json)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      cancelled = true
    }
  }, [file])

  return { data, error }
}
