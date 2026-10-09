import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import { clearAdminSession, isAdminLoggedIn } from '../auth/adminSession'
import { listApplications } from '../store/applications'

export default function VisitApproval() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/manager/login" replace />
  }

  return <VisitApprovalContent />
}

function VisitApprovalContent() {
  const rows = useMemo(() => listApplications(), [])

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
      <AdminNav />
      <h1>방문 승인</h1>
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th scope="col">방문업체</th>
              <th scope="col">방문자</th>
              <th scope="col">방문일시</th>
              <th scope="col">방문목적</th>
              <th scope="col">진행상태</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
