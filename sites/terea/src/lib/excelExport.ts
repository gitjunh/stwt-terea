import type { VisitApplication } from '../store/applications'
import type { UserRow } from '../store/adminEntities'

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function applicationsToCsv(rows: VisitApplication[]): string {
  const header = ['방문업체', '방문자', '휴대전화', '방문유형', '진행상태', '방문일시', '차량번호']
  const lines = rows.map((row) =>
    [
      row.company ?? '',
      row.name,
      row.phone,
      row.visitType ?? '',
      row.status,
      row.visitAt ?? '',
      row.vehicle ?? '',
    ]
      .map(escapeCsv)
      .join(','),
  )
  return [header.join(','), ...lines].join('\n')
}

export function downloadApplicationsExcel(rows: VisitApplication[]): void {
  downloadCsv('terea-visitors.xls', applicationsToCsv(rows))
}

export function usersToCsv(rows: UserRow[]): string {
  const header = [
    '사용자ID',
    '사용자명',
    '사용자명(영문)',
    '부서',
    '유선번호',
    '핸드폰',
    '이메일',
    '소재지',
    '사용권한',
    '사용여부',
  ]
  const lines = rows.map((row) =>
    [
      row.username,
      row.name,
      row.nameEn,
      row.department,
      row.landline,
      row.mobile,
      row.email,
      row.location,
      row.role,
      row.active ? 'Y' : 'N',
    ]
      .map(escapeCsv)
      .join(','),
  )
  return [header.join(','), ...lines].join('\n')
}

export function downloadUsersExcel(rows: UserRow[]): void {
  downloadCsv('terea-users.xls', usersToCsv(rows))
}
