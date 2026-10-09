import { useState } from 'react'
import AdminShell from '../components/AdminShell'
import {
  listApplications,
  updateApplicationStatus,
  type VisitApplication,
} from '../store/applications'
import { listQrNotices, recordQrNotice, type QrNotice } from '../store/qrNotices'

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

  function refresh() {
    setRows(listApplications())
    setNotices(listQrNotices())
  }

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
      {latest ? (
        <section className="qr-notice-panel" role="region" aria-label="QR 안내">
          <h2>승인 QR 안내</h2>
          <p>{latest.message}</p>
          <p className="qr-code">QR 코드: {latest.code}</p>
          <p>
            대상: {latest.name} ({latest.phone})
          </p>
        </section>
      ) : null}
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th scope="col">방문업체</th>
              <th scope="col">방문자</th>
              <th scope="col">방문일시</th>
              <th scope="col">방문목적</th>
              <th scope="col">진행상태</th>
              <th scope="col">처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.company ?? '-'}</td>
                <td>{row.name}</td>
                <td>{row.visitAt ?? '-'}</td>
                <td>{row.purpose ?? '-'}</td>
                <td>{row.status}</td>
                <td>
                  {row.status === '대기' ? (
                    <>
                      <button type="button" onClick={() => onApprove(row)}>
                        승인
                      </button>
                      <button type="button" onClick={() => onReject(row.id)}>
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
      {notices.length > 0 && !latest ? (
        <section className="qr-notice-panel" role="region" aria-label="QR 안내">
          <h2>승인 QR 안내</h2>
          <p>{notices[0].message}</p>
          <p className="qr-code">QR 코드: {notices[0].code}</p>
        </section>
      ) : null}
    </>
  )
}
