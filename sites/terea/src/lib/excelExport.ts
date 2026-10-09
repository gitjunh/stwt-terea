import type { VisitApplication } from '../store/applications'

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
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
  const csv = applicationsToCsv(rows)
  const blob = new Blob([`\uFEFF${csv}`], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'terea-visitors.xls'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
