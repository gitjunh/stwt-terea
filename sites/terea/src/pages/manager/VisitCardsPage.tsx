import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { localAdmin, type VisitCardRow } from '../../store/adminEntities'

type Mode = 'issue' | 'history'

export default function VisitCardsPage({ mode = 'issue' }: { mode?: Mode }) {
  const title = mode === 'history' ? '방문카드 발급/반납 조회' : '방문카드 발급/반납'
  return (
    <AdminShell title={title}>
      <VisitCardsContent mode={mode} title={title} />
    </AdminShell>
  )
}

function VisitCardsContent({ mode, title }: { mode: Mode; title: string }) {
  const [rows, setRows] = useState<VisitCardRow[]>([])
  const [editing, setEditing] = useState<VisitCardRow | null>(null)
  const [form, setForm] = useState({
    cardNo: '',
    visitorName: '',
    phone: '',
    status: '발급',
  })

  function refresh() {
    setRows(localAdmin.listVisitCards())
  }

  useEffect(() => {
    refresh()
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (mode === 'history') return
    const payload = {
      cardNo: form.cardNo,
      visitorName: form.visitorName,
      phone: form.phone || null,
      status: form.status,
      issuedAt: form.status === '발급' ? new Date().toISOString() : null,
      returnedAt: form.status === '반납' ? new Date().toISOString() : null,
    }
    if (editing) {
      localAdmin.updateVisitCard(editing.id, payload)
    } else {
      localAdmin.createVisitCard(payload)
    }
    setEditing(null)
    setForm({ cardNo: '', visitorName: '', phone: '', status: '발급' })
    refresh()
  }

  function onDelete(id: number) {
    if (mode === 'history') return
    localAdmin.deleteVisitCard(id)
    refresh()
  }

  function markReturn(row: VisitCardRow) {
    localAdmin.updateVisitCard(row.id, { status: '반납', returnedAt: new Date().toISOString() })
    refresh()
  }

  return (
    <>
      <h1>{title}</h1>
      {mode === 'issue' ? (
        <form className="admin-crud-form" onSubmit={onSubmit}>
          <label>
            카드번호
            <input
              value={form.cardNo}
              onChange={(e) => setForm((f) => ({ ...f, cardNo: e.target.value }))}
              required
            />
          </label>
          <label>
            방문자
            <input
              value={form.visitorName}
              onChange={(e) => setForm((f) => ({ ...f, visitorName: e.target.value }))}
              required
            />
          </label>
          <label>
            연락처
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </label>
          <label>
            상태
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="발급">발급</option>
              <option value="반납">반납</option>
              <option value="대기">대기</option>
            </select>
          </label>
          <button type="submit">{editing ? '수정 저장' : '신규'}</button>
        </form>
      ) : null}
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              {mode === 'issue' ? <th>처리</th> : null}
              <th>카드번호</th>
              <th>방문자</th>
              <th>연락처</th>
              <th>상태</th>
              <th>발급일시</th>
              <th>반납일시</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {mode === 'issue' ? (
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row)
                        setForm({
                          cardNo: row.cardNo,
                          visitorName: row.visitorName,
                          phone: row.phone || '',
                          status: row.status,
                        })
                      }}
                    >
                      수정
                    </button>
                    {row.status !== '반납' ? (
                      <button type="button" onClick={() => markReturn(row)}>
                        반납
                      </button>
                    ) : null}
                    <button type="button" onClick={() => onDelete(row.id)}>
                      삭제
                    </button>
                  </td>
                ) : null}
                <td>{row.cardNo}</td>
                <td>{row.visitorName}</td>
                <td>{row.phone || '-'}</td>
                <td>{row.status}</td>
                <td>{row.issuedAt || '-'}</td>
                <td>{row.returnedAt || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
