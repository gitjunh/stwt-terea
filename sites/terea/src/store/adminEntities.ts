/**
 * API 미가용(jsdom) 시 관리 CRUD용 메모리 폴백.
 * 서버 시드와 동일한 초기값을 둔다.
 */

export type UserRow = {
  id: number
  username: string
  name: string
  groupCode: string | null
  departmentId: number | null
  createdAt?: string
}

export type GroupRow = { code: string; name: string }

export type PermissionRow = {
  id: number
  groupCode: string
  menuName: string
  permissionName: string
  allowed: boolean
}

export type DeptRow = { id: number; code: string; name: string }

export type CodeRow = {
  id: number
  category: string
  code: string
  name: string
  sortOrder: number
}

export type VisitCardRow = {
  id: number
  cardNo: string
  visitorName: string
  phone?: string | null
  applicationId?: string | null
  status: string
  issuedAt?: string | null
  returnedAt?: string | null
}

export type AccessLogRow = {
  id: number
  visitorName: string
  cardNo?: string | null
  direction: string
  loggedAt: string
}

const KEY = 'terea-admin-entities'

type Bundle = {
  users: UserRow[]
  groups: GroupRow[]
  permissions: PermissionRow[]
  departments: DeptRow[]
  codes: CodeRow[]
  visitCards: VisitCardRow[]
  accessLogs: AccessLogRow[]
  nextIds: Record<string, number>
}

function defaultBundle(): Bundle {
  const groups: GroupRow[] = [
    { code: '1001', name: '관리자' },
    { code: '1002', name: '담당자' },
    { code: '1003', name: '결재자' },
    { code: '1004', name: 'STEC' },
  ]
  const menus: [string, string[]][] = [
    ['사용자 관리', ['조회', '편집']],
    ['권한그룹 관리', ['조회', '편집']],
    ['부서 관리', ['조회', '편집']],
    ['기초코드 관리', ['조회', '편집']],
    ['방문 승인', ['조회', '편집', '문자전송']],
    ['차량 승인', ['조회', '편집']],
    ['방문자 현황', ['조회', '편집']],
    ['방문카드 발급/반납', ['조회', '편집']],
    ['방문카드 발급/반납 조회', ['조회']],
    ['방문자 출입이력', ['조회']],
  ]
  let pid = 1
  const permissions: PermissionRow[] = []
  for (const g of groups) {
    for (const [menu, perms] of menus) {
      for (const p of perms) {
        permissions.push({
          id: pid++,
          groupCode: g.code,
          menuName: menu,
          permissionName: p,
          allowed: g.code === '1001',
        })
      }
    }
  }
  return {
    users: [
      {
        id: 1,
        username: 'terea-admin',
        name: '관리자',
        groupCode: '1001',
        departmentId: 1,
        createdAt: new Date().toISOString(),
      },
    ],
    groups,
    permissions,
    departments: [
      { id: 1, code: 'D001', name: '경영지원' },
      { id: 2, code: 'D002', name: '시설관리' },
      { id: 3, code: 'D003', name: '보안' },
    ],
    codes: [
      { id: 1, category: 'VISIT_TYPE', code: 'GENERAL', name: '일반', sortOrder: 1 },
      { id: 2, category: 'VISIT_TYPE', code: 'WORK', name: '업무', sortOrder: 2 },
      { id: 3, category: 'PURPOSE', code: 'MEETING', name: '미팅', sortOrder: 1 },
    ],
    visitCards: [
      {
        id: 1,
        cardNo: 'VC-1001',
        visitorName: '홍길동',
        phone: '01012345678',
        applicationId: 'stub-1',
        status: '발급',
        issuedAt: '2026-10-10T09:30:00',
        returnedAt: null,
      },
    ],
    accessLogs: [
      {
        id: 1,
        visitorName: '홍길동',
        cardNo: 'VC-1001',
        direction: '입장',
        loggedAt: '2026-10-10T09:35:00',
      },
    ],
    nextIds: { users: 2, departments: 4, codes: 4, visitCards: 2, accessLogs: 2, permissions: pid },
  }
}

function read(): Bundle {
  if (typeof window === 'undefined') return defaultBundle()
  const raw = window.localStorage.getItem(KEY)
  if (!raw) {
    const b = defaultBundle()
    window.localStorage.setItem(KEY, JSON.stringify(b))
    return b
  }
  try {
    return JSON.parse(raw) as Bundle
  } catch {
    return defaultBundle()
  }
}

function write(b: Bundle) {
  window.localStorage.setItem(KEY, JSON.stringify(b))
}

export const localAdmin = {
  listUsers: () => read().users,
  createUser: (row: Omit<UserRow, 'id'>) => {
    const b = read()
    const user = { ...row, id: b.nextIds.users++ }
    b.users.push(user)
    write(b)
    return user
  },
  updateUser: (id: number, patch: Partial<UserRow>) => {
    const b = read()
    const i = b.users.findIndex((u) => u.id === id)
    if (i < 0) return null
    b.users[i] = { ...b.users[i], ...patch, id }
    write(b)
    return b.users[i]
  },
  deleteUser: (id: number) => {
    const b = read()
    b.users = b.users.filter((u) => u.id !== id)
    write(b)
  },
  listGroups: () => read().groups,
  createGroup: (row: GroupRow) => {
    const b = read()
    b.groups.push(row)
    write(b)
    return row
  },
  updateGroup: (code: string, name: string) => {
    const b = read()
    const g = b.groups.find((x) => x.code === code)
    if (!g) return null
    g.name = name
    write(b)
    return g
  },
  deleteGroup: (code: string) => {
    const b = read()
    b.groups = b.groups.filter((g) => g.code !== code)
    b.permissions = b.permissions.filter((p) => p.groupCode !== code)
    write(b)
  },
  listPermissions: (groupCode: string) => read().permissions.filter((p) => p.groupCode === groupCode),
  savePermissions: (groupCode: string, items: { id: number; allowed: boolean }[]) => {
    const b = read()
    for (const item of items) {
      const p = b.permissions.find((x) => x.id === item.id && x.groupCode === groupCode)
      if (p) p.allowed = item.allowed
    }
    write(b)
  },
  listDepartments: () => read().departments,
  createDepartment: (row: Omit<DeptRow, 'id'>) => {
    const b = read()
    const d = { ...row, id: b.nextIds.departments++ }
    b.departments.push(d)
    write(b)
    return d
  },
  updateDepartment: (id: number, patch: Partial<DeptRow>) => {
    const b = read()
    const i = b.departments.findIndex((d) => d.id === id)
    if (i < 0) return null
    b.departments[i] = { ...b.departments[i], ...patch, id }
    write(b)
    return b.departments[i]
  },
  deleteDepartment: (id: number) => {
    const b = read()
    b.departments = b.departments.filter((d) => d.id !== id)
    write(b)
  },
  listCodes: () => read().codes,
  createCode: (row: Omit<CodeRow, 'id'>) => {
    const b = read()
    const c = { ...row, id: b.nextIds.codes++ }
    b.codes.push(c)
    write(b)
    return c
  },
  updateCode: (id: number, patch: Partial<CodeRow>) => {
    const b = read()
    const i = b.codes.findIndex((c) => c.id === id)
    if (i < 0) return null
    b.codes[i] = { ...b.codes[i], ...patch, id }
    write(b)
    return b.codes[i]
  },
  deleteCode: (id: number) => {
    const b = read()
    b.codes = b.codes.filter((c) => c.id !== id)
    write(b)
  },
  listVisitCards: () => read().visitCards,
  createVisitCard: (row: Omit<VisitCardRow, 'id'>) => {
    const b = read()
    const c = { ...row, id: b.nextIds.visitCards++ }
    b.visitCards.push(c)
    write(b)
    return c
  },
  updateVisitCard: (id: number, patch: Partial<VisitCardRow>) => {
    const b = read()
    const i = b.visitCards.findIndex((c) => c.id === id)
    if (i < 0) return null
    b.visitCards[i] = { ...b.visitCards[i], ...patch, id }
    write(b)
    return b.visitCards[i]
  },
  deleteVisitCard: (id: number) => {
    const b = read()
    b.visitCards = b.visitCards.filter((c) => c.id !== id)
    write(b)
  },
  listAccessLogs: () => read().accessLogs,
  createAccessLog: (row: Omit<AccessLogRow, 'id'>) => {
    const b = read()
    const c = { ...row, id: b.nextIds.accessLogs++ }
    b.accessLogs.unshift(c)
    write(b)
    return c
  },
  deleteAccessLog: (id: number) => {
    const b = read()
    b.accessLogs = b.accessLogs.filter((c) => c.id !== id)
    write(b)
  },
}
