import { useMemo, useState } from 'react'
import AdminColumnFilters, { filterRows } from '../components/AdminColumnFilters'
import AdminGridToolbar from '../components/AdminGridToolbar'
import AdminShell from '../components/AdminShell'
import { downloadApprovalsExcel } from '../lib/excelExport'
import {
  listApplications,
  periodLabel,
  updateApplicationStatus,
  type VisitApplication,
} from '../store/applications'
import ApprovalQrPanel from '../components/ApprovalQrPanel'
import { listQrNotices, recordQrNotice, type QrNotice } from '../store/qrNotices'

const FILTER_DEFS = [
  { key: 'company', label: '방문업체' },
  { key: 'title', label: '직급' },
  { key: 'name', label: '방문자' },
  { key: 'visitType', label: '방문유형' },
  { key: 'purpose', label: '방문목적' },
  { key: 'place', label: '장소' },
  { key: 'period', label: '방문기간' },
  { key: 'host', label: '찾아갈 분' },
  { key: 'status', label: '진행상태' },
]

export default function VisitApproval() {
  return (
    <AdminShell title="방문 승인">
      <VisitApprovalContent />
    </AdminShell>
  )
}

function VisitApprovalContent() {
  const [rows, setRows] = useState<VisitApplication[]>(() => listApplications())
  const [notices, setNotices] = useState<QrNotice[]>(() => listQrNotices())
  const [latest, setLatest] = useState<QrNotice | null>(null)
  const [filters, setFilters] = useState<Record<string, string>>({})

  function refresh() {
    setRows(listApplications())
    setNotices(listQrNotices())
  }

  const filtered = useMemo(
    () =>
      filterRows(rows, filters, {
        company: (r) => r.company ?? '',
        title: (r) => r.title ?? '',
        name: (r) => r.name,
        visitType: (r) => r.visitType ?? '',
        purpose: (r) => r.purpose ?? '',
        place: (r) => r.place ?? '',
        period: (r) => periodLabel(r),
        host: (r) => r.host ?? '',
        status: (r) => r.status,
      }),
    [rows, filters],
  )

  function onApprove(row: VisitApplication) {
    updateApplicationStatus(row.id, '승인')
    const notice = recordQrNotice({
      applicationId: row.id,
      name: row.name,
      phone: row.phone,
    })
    setLatest(notice)
    refresh()
  }

  function onReject(id: string) {
    updateApplicationStatus(id, '반려')
    refresh()
  }

  return (
    <>
      <h1>방문 승인</h1>
      <AdminGridToolbar
        onExcel={() => downloadApprovalsExcel(filtered)}
        onRefresh={refresh}
        onResetColumns={() => setFilters({})}
      />
      <p className="grid-group-hint">그룹화 할 열 머리글을 여기로 끌어옵니다.</p>
      {latest ? (
        <ApprovalQrPanel
          applicationId={latest.applicationId}
          name={latest.name}
          phone={latest.phone}
          code={latest.code}
          message={latest.message}
        />
      ) : null}
      <div className="visitor-table-wrap">
        <table className="visitor-table admin-data-grid">
          <thead>
            <tr>
              <th scope="col">방문업체</th>
              <th scope="col">직급</th>
              <th scope="col">방문자</th>
              <th scope="col">방문유형</th>
              <th scope="col">방문목적</th>
              <th scope="col">장소</th>
              <th scope="col">방문기간</th>
              <th scope="col">찾아갈 분</th>
              <th scope="col">진행상태</th>
              <th scope="col">처리</th>
            </tr>
            <AdminColumnFilters
              defs={FILTER_DEFS}
              values={filters}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
              trailingEmpty
            />
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.company ?? '-'}</td>
                <td>{row.title || '-'}</td>
                <td>{row.name}</td>
                <td>{row.visitType ?? '-'}</td>
                <td>{row.purpose ?? '-'}</td>
                <td>{row.place ?? '-'}</td>
                <td>{periodLabel(row)}</td>
                <td>{row.host ?? '-'}</td>
                <td>{row.status}</td>
                <td>
                  {row.status === '대기' || row.status === '신청' ? (
                    <>
                      <button type="button" className="approve-btn" onClick={() => onApprove(row)}>
                        승인
                      </button>
                      <button type="button" className="reject-btn" onClick={() => onReject(row.id)}>
                        반려
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="grid-page-info">페이지 1 of 1 ({filtered.length}건)</p>
      {notices.length > 0 && !latest ? (
        <ApprovalQrPanel
          applicationId={notices[0].applicationId}
          name={notices[0].name}
          phone={notices[0].phone}
          code={notices[0].code}
          message={notices[0].message}
        />
      ) : null}
    </>
  )
}
