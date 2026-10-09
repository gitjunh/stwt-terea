import { Link } from 'react-router-dom'

export default function ApplicationLookup() {
  return (
    <main className="lookup-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로 돌아가기</Link>
      </header>
      <h1>신청 조회</h1>
    </main>
  )
}
