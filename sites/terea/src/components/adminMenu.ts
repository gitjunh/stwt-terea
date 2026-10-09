export type AdminMenuItem = {
  to: string
  label: string
}

export type AdminMenuGroup = {
  id: string
  label: string
  items: AdminMenuItem[]
}

export const ADMIN_MENU: AdminMenuGroup[] = [
  {
    id: 'system',
    label: '시스템관리',
    items: [
      { to: '/manager/users', label: '사용자 관리' },
      { to: '/manager/permission-groups', label: '권한그룹 관리' },
      { to: '/manager/departments', label: '부서 관리' },
      { to: '/manager/codes', label: '기초코드 관리' },
    ],
  },
  {
    id: 'visitor',
    label: '방문자 관리',
    items: [
      { to: '/manager/approvals', label: '방문 승인' },
      { to: '/manager/vehicles', label: '차량 승인' },
      { to: '/manager/visitors', label: '방문자 현황' },
    ],
  },
  {
    id: 'cards',
    label: '방문카드 관리',
    items: [
      { to: '/manager/visit-cards', label: '방문카드 발급/반납' },
      { to: '/manager/visit-cards/history', label: '방문카드 발급/반납 조회' },
      { to: '/manager/access-logs', label: '방문자 출입이력' },
    ],
  },
]

export function titleForPath(pathname: string): string {
  for (const group of ADMIN_MENU) {
    for (const item of group.items) {
      if (item.to === pathname) return item.label
    }
  }
  return '관리'
}
