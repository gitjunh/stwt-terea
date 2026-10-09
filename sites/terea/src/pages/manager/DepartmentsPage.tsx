import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { tryApiFetch } from '../../api/http'
import { localAdmin, type DeptRow } from '../../store/adminEntities'

export default function DepartmentsPage() {
  return (
    <AdminShell title="부서 관리">
      <DepartmentsContent />
    </AdminShell>
  )
}

function DepartmentsContent() {
  const [rows, setRows] = useState<DeptRow[]>([])
  const [editing, setEditing] = useState<DeptRow | null>(null)
  const [form, setForm] = useState({ code: '', name: '' })

  async function refresh() {
    const api = await tryApiFetch<DeptRow[]>('/api/departments')
    setRows(api ?? localAdmin.listDepartments())
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) {
      const api = await tryApiFetch(`/api/departments/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      })
      if (!api) localAdmin.updateDepartment(editing.id, form)
    } else {
      const api = await tryApiFetch('/api/departments', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (!api) localAdmin.createDepartment(form)
    }
    setEditing(null)
    setForm({ code: '', name: '' })
    await refresh()
  }

  async function onDelete(id: number) {
    const api = await tryApiFetch(`/api/departments/${id}`, { method: 'DELETE' })
    if (!api) localAdmin.deleteDepartment(id)
    await refresh()
  }

  return (
    <>
      <h1>부서 관리</h1>
      <form className="admin-crud-form" onSubmit={onSubmit}>
        <label>
          부서코드
          <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required />
        </label>
        <label>
          부서명
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </label>
        <button type="submit">{editing ? '수정 저장' : '신규'}</button>
      </form>
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>처리</th>
              <th>코드</th>
              <th>부서명</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <button type="button" onClick={() => { setEditing(row); setForm({ code: row.code, name: row.name }) }}>
                    수정
                  </button>
                  <button type="button" onClick={() => void onDelete(row.id)}>
                    삭제
                  </button>
                </td>
                <td>{row.code}</td>
                <td>{row.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
