import { Link, Navigate } from 'react-router-dom'
import { clearAdminSession, isAdminLoggedIn } from '../auth/adminSession'

export default function VisitorStatus() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/manager/login" replace />
  }

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
    </main>
  )
}
