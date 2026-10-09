export type ApplicationStatus = '대기' | '승인' | '반려'

export type VisitApplication = {
  id: string
  name: string
  phone: string
  status: ApplicationStatus
  company?: string
}

const STORAGE_KEY = 'terea-applications'

const STUB: VisitApplication[] = [
  { id: 'stub-1', name: '홍길동', phone: '01012345678', status: '승인', company: 'terea 파트너' },
  { id: 'stub-2', name: '김대기', phone: '01099998888', status: '대기' },
  { id: 'stub-3', name: '이반려', phone: '01077776666', status: '반려' },
]

function readAll(): VisitApplication[] {
  if (typeof window === 'undefined') return [...STUB]
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(STUB))
    return [...STUB]
  }
  try {
    return JSON.parse(raw) as VisitApplication[]
  } catch {
    return [...STUB]
  }
}

export function lookupApplications(name: string, phone: string): VisitApplication[] {
  const normalizedPhone = phone.replace(/\D/g, '')
  return readAll().filter(
    (item) => item.name === name.trim() && item.phone.replace(/\D/g, '') === normalizedPhone,
  )
}

export function saveApplication(app: VisitApplication): void {
  const all = readAll()
  all.push(app)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
