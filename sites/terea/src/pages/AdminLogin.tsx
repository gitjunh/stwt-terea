import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { tryApiFetch } from '../api/http'
import { verifyAdminCredentials } from '../auth/adminAccounts'
import { setAdminSession } from '../auth/adminSession'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = id.trim()
    // 로컬 시드(테스트·오프라인)는 동기 처리 — 기존 vitest 유지
    if (verifyAdminCredentials(trimmed, password)) {
      setAdminSession(trimmed)
      navigate('/manager/visitors')
      return
    }
    setPending(true)
    setError('')
    void (async () => {
      const api = await tryApiFetch<{ ok: boolean; user: { id: string } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ id: trimmed, password }),
      })
      setPending(false)
      if (api?.ok) {
        setAdminSession(api.user.id || trimmed)
        navigate('/manager/visitors')
        return
      }
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    })()
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
          <input
            name="adminId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
          />
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
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={pending}>
          로그인
        </button>
      </form>
    </main>
  )
}
