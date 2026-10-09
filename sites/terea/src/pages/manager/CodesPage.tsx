import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { tryApiFetch } from '../../api/http'
import { localAdmin, type CodeRow } from '../../store/adminEntities'

export default function CodesPage() {
  return (
    <AdminShell title="기초코드 관리">
      <CodesContent />
    </AdminShell>
  )
}

function CodesContent() {
  const [rows, setRows] = useState<CodeRow[]>([])
  const [editing, setEditing] = useState<CodeRow | null>(null)
  const [form, setForm] = useState({ category: '', code: '', name: '', sortOrder: 0 })

  async function refresh() {
    const api = await tryApiFetch<CodeRow[]>('/api/codes')
    setRows(api ?? localAdmin.listCodes())
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) {
      const api = await tryApiFetch(`/api/codes/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      })
      if (!api) localAdmin.updateCode(editing.id, form)
    } else {
      const api = await tryApiFetch('/api/codes', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (!api) localAdmin.createCode(form)
    }
    setEditing(null)
    setForm({ category: '', code: '', name: '', sortOrder: 0 })
    await refresh()
  }

  async function onDelete(id: number) {
    const api = await tryApiFetch(`/api/codes/${id}`, { method: 'DELETE' })
    if (!api) localAdmin.deleteCode(id)
    await refresh()
  }

  return (
    <>
      <h1>기초코드 관리</h1>
      <form className="admin-crud-form" onSubmit={onSubmit}>
        <label>
          분류
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
          />
        </label>
        <label>
          코드
          <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required />
        </label>
        <label>
          명칭
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </label>
        <label>
          정렬
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
        </label>
        <button type="submit">{editing ? '수정 저장' : '신규'}</button>
      </form>
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>처리</th>
              <th>분류</th>
              <th>코드</th>
              <th>명칭</th>
              <th>정렬</th>
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
                        category: row.category,
                        code: row.code,
                        name: row.name,
                        sortOrder: row.sortOrder,
                      })
                    }}
                  >
                    수정
                  </button>
                  <button type="button" onClick={() => void onDelete(row.id)}>
                    삭제
                  </button>
                </td>
                <td>{row.category}</td>
                <td>{row.code}</td>
                <td>{row.name}</td>
                <td>{row.sortOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
