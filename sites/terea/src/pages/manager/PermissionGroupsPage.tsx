import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { tryApiFetch } from '../../api/http'
import { localAdmin, type GroupRow, type PermissionRow } from '../../store/adminEntities'

export default function PermissionGroupsPage() {
  return (
    <AdminShell title="권한그룹 관리">
      <PermissionGroupsContent />
    </AdminShell>
  )
}

function PermissionGroupsContent() {
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [perms, setPerms] = useState<PermissionRow[]>([])
  const [editing, setEditing] = useState<GroupRow | null>(null)
  const [form, setForm] = useState({ code: '', name: '' })

  async function refreshGroups() {
    const api = await tryApiFetch<GroupRow[]>('/api/permission-groups')
    const list = api ?? localAdmin.listGroups()
    setGroups(list)
    if (!selected && list[0]) setSelected(list[0].code)
    return list
  }

  async function refreshPerms(code: string) {
    const api = await tryApiFetch<PermissionRow[]>(`/api/permissions?groupCode=${encodeURIComponent(code)}`)
    setPerms(api ?? localAdmin.listPermissions(code))
  }

  useEffect(() => {
    void refreshGroups()
  }, [])

  useEffect(() => {
    if (selected) void refreshPerms(selected)
  }, [selected])

  async function onSaveGroup(e: FormEvent) {
    e.preventDefault()
    if (editing) {
      const api = await tryApiFetch(`/api/permission-groups/${editing.code}`, {
        method: 'PUT',
        body: JSON.stringify({ name: form.name }),
      })
      if (!api) localAdmin.updateGroup(editing.code, form.name)
    } else {
      const api = await tryApiFetch('/api/permission-groups', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (!api) localAdmin.createGroup({ code: form.code, name: form.name })
    }
    setEditing(null)
    setForm({ code: '', name: '' })
    await refreshGroups()
  }

  async function onDeleteGroup(code: string) {
    const api = await tryApiFetch(`/api/permission-groups/${code}`, { method: 'DELETE' })
    if (!api) localAdmin.deleteGroup(code)
    if (selected === code) setSelected(null)
    await refreshGroups()
  }

  function togglePerm(id: number) {
    setPerms((prev) => prev.map((p) => (p.id === id ? { ...p, allowed: !p.allowed } : p)))
  }

  async function onSavePerms() {
    if (!selected) return
    const items = perms.map((p) => ({ id: p.id, allowed: p.allowed }))
    const api = await tryApiFetch('/api/permissions', {
      method: 'PUT',
      body: JSON.stringify({ groupCode: selected, items }),
    })
    if (!api) localAdmin.savePermissions(selected, items)
    await refreshPerms(selected)
  }

  return (
    <>
      <h1>권한그룹 관리</h1>
      <div className="admin-split">
        <section className="admin-pane" aria-label="권한그룹">
          <div className="admin-pane-head">
            <h2>권한그룹</h2>
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setForm({ code: '', name: '' })
              }}
            >
              신규
            </button>
          </div>
          <form className="admin-crud-form compact" onSubmit={onSaveGroup}>
            <label>
              그룹코드
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                disabled={Boolean(editing)}
                required
              />
            </label>
            <label>
              그룹명
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <button type="submit">{editing ? '수정 저장' : '등록'}</button>
          </form>
          <div className="visitor-table-wrap">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>처리</th>
                  <th>그룹코드</th>
                  <th>그룹명</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr
                    key={g.code}
                    className={selected === g.code ? 'is-selected' : undefined}
                    onClick={() => setSelected(g.code)}
                  >
                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditing(g)
                          setForm({ code: g.code, name: g.name })
                        }}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          void onDeleteGroup(g.code)
                        }}
                      >
                        삭제
                      </button>
                    </td>
                    <td>{g.code}</td>
                    <td>{g.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-pane" aria-label="권한 목록">
          <div className="admin-pane-head">
            <h2>권한 목록</h2>
            <button type="button" onClick={() => void onSavePerms()} disabled={!selected}>
              저장
            </button>
          </div>
          <div className="visitor-table-wrap">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>메뉴명</th>
                  <th>권한명</th>
                  <th>권한여부</th>
                </tr>
              </thead>
              <tbody>
                {perms.map((p) => (
                  <tr key={p.id}>
                    <td>{p.menuName}</td>
                    <td>{p.permissionName}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={p.allowed}
                        onChange={() => togglePerm(p.id)}
                        aria-label={`${p.menuName} ${p.permissionName}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
