import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { lookupApplications, type VisitApplication } from '../store/applications'

export default function ApplicationLookup() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [results, setResults] = useState<VisitApplication[] | null>(null)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setResults(lookupApplications(name, phone))
  }

  return (
    <main className="lookup-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로 돌아가기</Link>
      </header>
      <h1>신청 조회</h1>
      <form className="lookup-form" onSubmit={onSubmit}>
        <label>
          성명
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          휴대전화
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <button type="submit">조회</button>
      </form>
      {results && (
        <section className="lookup-results" aria-live="polite">
          {results.length === 0 ? (
            <p>조회 결과가 없습니다.</p>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <span className={`status status-${item.status}`}>{item.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}
