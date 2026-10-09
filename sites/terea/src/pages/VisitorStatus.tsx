import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { clearAdminSession, isAdminLoggedIn } from '../auth/adminSession'
import { listApplications, type VisitApplication } from '../store/applications'

export default function VisitorStatus() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/manager/login" replace />
  }

  return <VisitorStatusContent />
}

function VisitorStatusContent() {
  const [rows] = useState<VisitApplication[]>(() => listApplications())

  const tableRows = useMemo(() => rows, [rows])

  return (
    <main className="admin-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <p className="context">방문자 관리</p>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => {
            clearAdminSession()
            window.location.assign('/manager/login')
          }}
        >
          로그아웃
        </button>
      </header>
      <nav className="admin-nav" aria-label="관리 메뉴">
        <Link to="/manager/visitors" aria-current="page">
          방문자 현황
        </Link>
      </nav>
      <h1>방문자 현황</h1>
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
            {tableRows.map((row) => (
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
    </main>
  )
}
