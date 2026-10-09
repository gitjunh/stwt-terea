import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { tryApiFetch } from '../../api/http'
import { localAdmin, type AccessLogRow } from '../../store/adminEntities'

export default function AccessLogsPage() {
  return (
    <AdminShell title="방문자 출입이력">
      <AccessLogsContent />
    </AdminShell>
  )
}

function AccessLogsContent() {
  const [rows, setRows] = useState<AccessLogRow[]>([])
  const [form, setForm] = useState({ visitorName: '', cardNo: '', direction: '입장' })

  async function refresh() {
    const api = await tryApiFetch<AccessLogRow[]>('/api/access-logs')
    setRows(api ?? localAdmin.listAccessLogs())
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = {
      visitorName: form.visitorName,
      cardNo: form.cardNo || null,
      direction: form.direction,
      loggedAt: new Date().toISOString(),
    }
    const api = await tryApiFetch('/api/access-logs', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!api) localAdmin.createAccessLog(payload)
    setForm({ visitorName: '', cardNo: '', direction: '입장' })
    await refresh()
  }

  async function onDelete(id: number) {
    const api = await tryApiFetch(`/api/access-logs/${id}`, { method: 'DELETE' })
    if (!api) localAdmin.deleteAccessLog(id)
    await refresh()
  }

  return (
    <>
      <h1>방문자 출입이력</h1>
      <form className="admin-crud-form" onSubmit={onSubmit}>
        <label>
          방문자
          <input
            value={form.visitorName}
            onChange={(e) => setForm((f) => ({ ...f, visitorName: e.target.value }))}
            required
          />
        </label>
        <label>
          카드번호
          <input value={form.cardNo} onChange={(e) => setForm((f) => ({ ...f, cardNo: e.target.value }))} />
        </label>
        <label>
          구분
          <select
            value={form.direction}
            onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value }))}
          >
            <option value="입장">입장</option>
            <option value="퇴장">퇴장</option>
          </select>
        </label>
        <button type="submit">등록</button>
      </form>
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th>처리</th>
              <th>방문자</th>
              <th>카드번호</th>
              <th>구분</th>
              <th>일시</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <button type="button" onClick={() => void onDelete(row.id)}>
                    삭제
                  </button>
                </td>
                <td>{row.visitorName}</td>
                <td>{row.cardNo || '-'}</td>
                <td>{row.direction}</td>
                <td>{row.loggedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
