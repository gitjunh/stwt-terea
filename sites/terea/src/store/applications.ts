export type ApplicationStatus = '대기' | '승인' | '반려'

export type VisitApplication = {
  id: string
  name: string
  phone: string
  status: ApplicationStatus
  company?: string
  visitAt?: string
  visitType?: string
  purpose?: string
  host?: string
  vehicle?: string
  facePhotoName?: string
}

const STORAGE_KEY = 'terea-applications'

const STUB: VisitApplication[] = [
  {
    id: 'stub-1',
    name: '홍길동',
    phone: '01012345678',
    status: '승인',
    company: 'terea 파트너',
    visitAt: '2026-10-10T09:00',
    visitType: '일반',
    purpose: '미팅',
    host: '김담당',
  },
  {
    id: 'stub-2',
    name: '김대기',
    phone: '01099998888',
    status: '대기',
    company: '외부업체A',
    visitAt: '2026-10-12T14:00',
    visitType: '업무',
    purpose: '점검',
    host: '이담당',
  },
  {
    id: 'stub-3',
    name: '이반려',
    phone: '01077776666',
    status: '반려',
    company: '외부업체B',
    visitAt: '2026-10-08T11:00',
    visitType: '공사',
    purpose: '공사',
    host: '박담당',
  },
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

export function listApplications(): VisitApplication[] {
  return readAll()
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

export function updateApplicationStatus(id: string, status: ApplicationStatus): VisitApplication | null {
  const all = readAll()
  const index = all.findIndex((item) => item.id === id)
  if (index < 0) return null
  all[index] = { ...all[index], status }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return all[index]
}
