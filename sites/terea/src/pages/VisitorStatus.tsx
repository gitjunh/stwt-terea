import { FormEvent, useMemo, useState } from 'react'
import AdminShell from '../components/AdminShell'
import { downloadApplicationsExcel } from '../lib/excelExport'
import { listApplications, type VisitApplication } from '../store/applications'
import { getDefaultLinkMessage, recordLinkSend } from '../store/linkSends'

function visitDateOnly(visitAt?: string): string | null {
  if (!visitAt) return null
  return visitAt.slice(0, 10)
}

function inRange(visitAt: string | undefined, from: string, to: string): boolean {
  const day = visitDateOnly(visitAt)
  if (!day) return false
  if (from && day < from) return false
  if (to && day > to) return false
  return true
}

export default function VisitorStatus() {
  return (
    <AdminShell title="방문자 현황">
      <VisitorStatusContent />
    </AdminShell>
  )
}

function VisitorStatusContent() {
  const allRows = useMemo(() => listApplications(), [])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [rows, setRows] = useState<VisitApplication[]>(allRows)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkPhone, setLinkPhone] = useState('')
  const [linkMessage, setLinkMessage] = useState(getDefaultLinkMessage())
  const [linkSuccess, setLinkSuccess] = useState(false)

  function onSearch(event: FormEvent) {
    event.preventDefault()
    if (!from && !to) {
      setRows(allRows)
      return
    }
    setRows(allRows.filter((row) => inRange(row.visitAt, from, to)))
  }

  function onSendLink(event: FormEvent) {
    event.preventDefault()
    recordLinkSend(linkPhone, linkMessage)
    setLinkSuccess(true)
  }

  return (
    <>
      <h1>방문자 현황</h1>
      <div className="admin-toolbar">
        <button type="button" onClick={() => downloadApplicationsExcel(rows)}>
          엑셀출력
        </button>
        <button
          type="button"
          onClick={() => {
            setLinkOpen(true)
            setLinkSuccess(false)
          }}
        >
          방문신청 링크 보내기
        </button>
      </div>
      <form className="search-form" onSubmit={onSearch}>
        <label>
          시작일
          <input type="date" name="from" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          종료일
          <input type="date" name="to" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button type="submit">검색</button>
      </form>
      {linkOpen ? (
        <section className="link-send-panel" aria-label="방문신청 링크 보내기">
          <h2>방문신청 링크 보내기</h2>
          <p>실SMS는 발송하지 않으며, 로컬에만 기록됩니다.</p>
          <form className="lookup-form" onSubmit={onSendLink}>
            <label>
              수신 전화번호
              <input
                type="tel"
                value={linkPhone}
                onChange={(e) => setLinkPhone(e.target.value)}
                required
              />
            </label>
            <label>
              메시지
              <textarea
                value={linkMessage}
                onChange={(e) => setLinkMessage(e.target.value)}
                rows={3}
              />
            </label>
            <button type="submit">전송</button>
            <button type="button" onClick={() => setLinkOpen(false)}>
              닫기
            </button>
          </form>
          {linkSuccess ? <p role="status">전송 성공 (로컬 기록)</p> : null}
        </section>
      ) : null}
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th scope="col">방문업체</th>
              <th scope="col">방문자</th>
              <th scope="col">휴대전화</th>
              <th scope="col">방문유형</th>
              <th scope="col">진행상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.company ?? '-'}</td>
                <td>{row.name}</td>
                <td>{row.phone}</td>
                <td>{row.visitType ?? '-'}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
