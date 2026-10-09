const API_BASE = ''

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(res.status, text || res.statusText)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** jsdom/서버 미기동 시 null — 호출부에서 로컬 스토어 폴백 */
export async function tryApiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (import.meta.env.MODE === 'test') return null
  try {
    return await apiFetch<T>(path, init)
  } catch {
    return null
  }
}
