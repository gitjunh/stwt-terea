import { LOCAL_VISITOR_SEED } from '../auth/visitorAccounts'

export type ApplicationStatus = '대기' | '승인' | '반려' | '신청' | '완료'
export type VehicleStatus = '대기' | '승인' | '미승인' | '반려'

export type VisitApplication = {
  id: string
  name: string
  phone: string
  status: ApplicationStatus
  company?: string
  title?: string
  visitAt?: string
  visitStart?: string
  visitEnd?: string
  visitType?: string
  purpose?: string
  place?: string
  host?: string
  hostPhone?: string
  vehicle?: string
  vehicleStatus?: VehicleStatus
  facePhotoName?: string
  approvalMemo?: string
  cardName?: string
  issuedAt?: string
  returnedAt?: string
  cardStatus?: string
}

const STORAGE_KEY = 'terea-applications'
const DEMO_FLAG_KEY = 'terea-applications-demo-v24'

const NAMES = [
  '김대기',
  '홍길동',
  '이반려',
  '박서준',
  '최유진',
  '정민호',
  '강하늘',
  '윤지우',
  '장도윤',
  '임수빈',
  '한예슬',
  '오세진',
  '신동욱',
  '권미래',
  '배준혁',
  '송지아',
  '유태호',
  '문채린',
  '서현우',
  '조은별',
]
const COMPANIES = [
  '(주)terea파트너',
  '명진에코',
  '창일주유소',
  '세기산업ENG',
  '무진아이',
  '대한산업보건',
  '부원이엔티',
  '천일시스템',
  '관세법인대원',
  '외부업체A',
]
const TITLES = ['사원', '대리', '과장', '차장', '부장', '이사', '기사', '매니저', '소장']
const TYPES = ['방문(일반,협의,심사)', '단기근로', '정기출입', '공사(납품)']
const PURPOSES = [
  '회의참석 및 업무협의',
  '공사/작업,유지보수',
  '물품 반입/반출',
  '폐기물반출',
  '설비점검',
  '자재납품',
]
const PLACES = [
  '본관 경비실',
  '제련동 출입구',
  '품질실험실',
  '창고 A동',
  '사무동 로비',
  '정비작업장',
]
const HOSTS = ['김담당', '이담당', '박담당', '최담당', '정담당', '테스트담당']

function buildDemoApps(): VisitApplication[] {
  const apps: VisitApplication[] = [
    {
      id: 'stub-visitor-local',
      name: LOCAL_VISITOR_SEED.name,
      phone: LOCAL_VISITOR_SEED.phone,
      status: '대기',
      company: LOCAL_VISITOR_SEED.company,
      title: '사원',
      visitAt: '2026-10-20T10:00',
      visitStart: '2026-10-20',
      visitEnd: '2026-10-20',
      visitType: '방문(일반,협의,심사)',
      purpose: '로컬 방문 테스트',
      place: '본관 경비실',
      host: '테스트담당',
      hostPhone: '01011112222',
    },
  ]

  for (let i = 0; i < 20; i++) {
    const start = `2026-10-${String(5 + (i % 20)).padStart(2, '0')}`
    const end = `2026-10-${String(Math.min(28, 8 + (i % 20))).padStart(2, '0')}`
    const hasVehicle = i % 2 === 1 || NAMES[i % NAMES.length] === '김대기'
    const statusCycle: ApplicationStatus[] = ['신청', '대기', '승인', '완료', '반려']
    const status = statusCycle[i % statusCycle.length]
    const cardIssued = status === '승인' || status === '완료'
    const name = NAMES[i % NAMES.length]
    apps.push({
      id: name === '김대기' ? 'stub-2' : name === '홍길동' ? 'stub-1' : name === '이반려' ? 'stub-3' : `demo-app-${i + 1}`,
      name,
      phone:
        name === '김대기'
          ? '01099998888'
          : name === '홍길동'
            ? '01012345678'
            : name === '이반려'
              ? '01077776666'
              : `010${String(3000 + i).slice(-4)}${String(1000 + i * 17).slice(-4)}`,
      status: name === '김대기' ? '대기' : name === '홍길동' ? '승인' : name === '이반려' ? '반려' : status,
      company: COMPANIES[i % COMPANIES.length],
      title: TITLES[i % TITLES.length],
      visitAt:
        name === '김대기'
          ? '2026-10-12T14:00'
          : name === '홍길동'
            ? '2026-10-10T09:00'
            : name === '이반려'
              ? '2026-10-08T11:00'
              : `${start}T09:00`,
      visitStart:
        name === '김대기' ? '2026-10-12' : name === '홍길동' ? '2026-10-10' : name === '이반려' ? '2026-10-08' : start,
      visitEnd:
        name === '김대기' ? '2026-10-12' : name === '홍길동' ? '2026-10-10' : name === '이반려' ? '2026-10-08' : end,
      visitType: TYPES[i % TYPES.length],
      purpose: PURPOSES[i % PURPOSES.length],
      place: PLACES[i % PLACES.length],
      host: HOSTS[i % HOSTS.length],
      hostPhone: `010-${2000 + i}-${3000 + i}`,
      vehicle: name === '김대기' ? '12가3456' : hasVehicle ? `${10 + i}가${1000 + i}` : undefined,
      vehicleStatus: name === '김대기' ? '대기' : hasVehicle ? (i % 3 === 0 ? '승인' : '대기') : undefined,
      approvalMemo: status === '반려' || name === '이반려' ? '일정 조율 필요' : '',
      cardName: cardIssued || name === '홍길동' ? `terea방문증${String(i + 1).padStart(3, '0')}` : '',
      issuedAt: cardIssued || name === '홍길동' ? `${start}T09:30:00` : '',
      returnedAt: status === '완료' ? `${end}T17:00:00` : '',
      cardStatus: status === '완료' ? '퇴실' : cardIssued || name === '홍길동' ? '입실' : '대기',
    })
  }
  return apps
}

function normalize(app: VisitApplication): VisitApplication {
  return {
    ...app,
    title: app.title ?? '',
    place: app.place ?? '본관 경비실',
    visitStart: app.visitStart ?? app.visitAt?.slice(0, 10) ?? '',
    visitEnd: app.visitEnd ?? app.visitAt?.slice(0, 10) ?? '',
    hostPhone: app.hostPhone ?? '',
    approvalMemo: app.approvalMemo ?? '',
    cardName: app.cardName ?? '',
    issuedAt: app.issuedAt ?? '',
    returnedAt: app.returnedAt ?? '',
    cardStatus: app.cardStatus ?? '',
  }
}

function readAll(): VisitApplication[] {
  if (typeof window === 'undefined') return buildDemoApps().map(normalize)
  const flagged = window.localStorage.getItem(DEMO_FLAG_KEY) === '1'
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw || !flagged) {
    const demos = buildDemoApps().map(normalize)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demos))
    window.localStorage.setItem(DEMO_FLAG_KEY, '1')
    return demos
  }
  try {
    return (JSON.parse(raw) as VisitApplication[]).map(normalize)
  } catch {
    return buildDemoApps().map(normalize)
  }
}

function writeAll(all: VisitApplication[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  window.localStorage.setItem(DEMO_FLAG_KEY, '1')
}

export function listApplications(): VisitApplication[] {
  return readAll()
}

export function listVehicleApplications(): VisitApplication[] {
  return readAll().filter((a) => Boolean(a.vehicle))
}

export function lookupApplications(name: string, phone: string): VisitApplication[] {
  const normalizedPhone = phone.replace(/\D/g, '')
  return readAll().filter(
    (item) => item.name === name.trim() && item.phone.replace(/\D/g, '') === normalizedPhone,
  )
}

export function saveApplication(app: VisitApplication): void {
  const all = readAll()
  all.push(normalize(app))
  writeAll(all)
}

export function updateApplicationStatus(id: string, status: ApplicationStatus): VisitApplication | null {
  const all = readAll()
  const index = all.findIndex((item) => item.id === id)
  if (index < 0) return null
  all[index] = { ...all[index], status }
  writeAll(all)
  return all[index]
}

export function updateVehicleStatus(id: string, vehicleStatus: VehicleStatus): VisitApplication | null {
  const all = readAll()
  const index = all.findIndex((item) => item.id === id)
  if (index < 0) return null
  all[index] = { ...all[index], vehicleStatus }
  writeAll(all)
  return all[index]
}

export function updateApplication(id: string, patch: Partial<VisitApplication>): VisitApplication | null {
  const all = readAll()
  const index = all.findIndex((item) => item.id === id)
  if (index < 0) return null
  all[index] = normalize({ ...all[index], ...patch, id })
  writeAll(all)
  return all[index]
}

export function periodLabel(app: VisitApplication): string {
  const s = app.visitStart || app.visitAt?.slice(0, 10) || ''
  const e = app.visitEnd || s
  if (!s) return '-'
  return `${s} ~ ${e}`
}
