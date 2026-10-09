import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { tryApiFetch } from '../../api/http'
import { localAdmin, type UserRow } from '../../store/adminEntities'

export default function UsersPage() {
  return (
    <AdminShell title="사용자 관리">
      <UsersContent />
    </AdminShell>
  )
}

function UsersContent() {
  const [rows, setRows] = useState<UserRow[]>([])
  const [editing, setEditing] = useState<UserRow | null>(null)
  const [form, setForm] = useState({ username: '', name: '', groupCode: '1001', password: '' })

  async function refresh() {
    const api = await tryApiFetch<UserRow[]>('/api/users')
    setRows(api ?? localAdmin.listUsers())
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) {
      const body = {
        username: form.username,
        name: form.name,
        groupCode: form.groupCode,
        password: form.password || undefined,
      }
      const api = await tryApiFetch<UserRow>(`/api/users/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      })
      if (!api) {
        localAdmin.updateUser(editing.id, {
          username: form.username,
          name: form.name,
          groupCode: form.groupCode,
        })
      }
    } else {
      const body = {
        username: form.username,
        name: form.name,
        groupCode: form.groupCode,
        password: form.password || 'change-me',
      }
      const api = await tryApiFetch<UserRow>('/api/users', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!api) {
        localAdmin.createUser({
          username: form.username,
          name: form.name,
          groupCode: form.groupCode,
          departmentId: 1,
        })
      }
    }
    setEditing(null)
    setForm({ username: '', name: '', groupCode: '1001', password: '' })
    await refresh()
  }

  async function onDelete(id: number) {
    const api = await tryApiFetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!api) localAdmin.deleteUser(id)
    await refresh()
  }

  return (
    <>
      <h1>사용자 관리</h1>
      <form className="admin-crud-form" onSubmit={onSubmit}>
        <label>
          아이디
          <input
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
          />
        </label>
        <label>
          이름
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </label>
        <label>
          권한그룹
          <input
            value={form.groupCode}
            onChange={(e) => setForm((f) => ({ ...f, groupCode: e.target.value }))}
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={editing ? '(변경 시만)' : ''}
          />
        </label>
        <button type="submit">{editing ? '수정 저장' : '신규'}</button>
        {editing ? (
          <button type="button" onClick={() => { setEditing(null); setForm({ username: '', name: '', groupCode: '1001', password: '' }) }}>
            취소
          </button>
        ) : null}
      </form>
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>처리</th>
              <th>ID</th>
              <th>아이디</th>
              <th>이름</th>
              <th>권한그룹</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(row)
                      setForm({
                        username: row.username,
                        name: row.name,
                        groupCode: row.groupCode || '',
                        password: '',
                      })
                    }}
                  >
                    수정
                  </button>
                  <button type="button" onClick={() => void onDelete(row.id)}>
                    삭제
                  </button>
                </td>
                <td>{row.id}</td>
                <td>{row.username}</td>
                <td>{row.name}</td>
                <td>{row.groupCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
