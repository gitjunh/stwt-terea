import { Link } from 'react-router-dom'

export default function VisitMain() {
  return (
    <main className="visit-main">
      <header className="site-header">
        <p className="brand">terea</p>
        <p className="context">방문 예약</p>
      </header>
      <section className="hero">
        <h1>방문을 환영합니다.</h1>
        <nav className="main-ctas" aria-label="주요 진입">
          <Link to="/apply/privacy">방문신청</Link>
          <Link to="/lookup">신청 조회</Link>
        </nav>
      </section>
    </main>
  )
}
