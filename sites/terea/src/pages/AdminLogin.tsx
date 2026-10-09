import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
  }

  return (
    <main className="admin-login">
      <header className="site-header">
        <p className="brand">terea</p>
        <p className="context">방문예약·관리</p>
        <Link to="/">방문 메인</Link>
      </header>
      <h1>관리 로그인</h1>
      <form className="lookup-form" onSubmit={onSubmit}>
        <label>
          ID
          <input name="adminId" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" />
        </label>
        <label>
          PW
          <input
            name="adminPw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="submit">로그인</button>
      </form>
    </main>
  )
}
