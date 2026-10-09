import { FormEvent, useMemo, useState } from 'react'
import AdminColumnFilters, { filterRows } from '../../components/AdminColumnFilters'
import AdminGridToolbar from '../../components/AdminGridToolbar'
import AdminShell from '../../components/AdminShell'
import { downloadAccessLogsExcel } from '../../lib/excelExport'
import { localAdmin, type AccessLogRow } from '../../store/adminEntities'

const FILTER_DEFS = [
  { key: 'loggedAt', label: '인증일시' },
  { key: 'issuedAt', label: '발급일시' },
  { key: 'returnedAt', label: '반납일시' },
  { key: 'cardName', label: '카드이름' },
  { key: 'visitType', label: '방문유형' },
  { key: 'company', label: '방문업체' },
  { key: 'title', label: '직급' },
  { key: 'visitorName', label: '방문자' },
  { key: 'host', label: '찾아갈분' },
]

export default function AccessLogsPage() {
  return (
    <AdminShell title="방문자 출입이력">
      <AccessLogsContent />
    </AdminShell>
  )
}

function AccessLogsContent() {
  const [rows, setRows] = useState<AccessLogRow[]>(() => localAdmin.listAccessLogs())
  const [from, setFrom] = useState('2026-10-01')
  const [to, setTo] = useState('2026-10-10')
  const [searched, setSearched] = useState(rows)
  const [filters, setFilters] = useState<Record<string, string>>({})

  function refresh() {
    const next = localAdmin.listAccessLogs()
    setRows(next)
    setSearched(next)
  }

  function onSearch(e: FormEvent) {
    e.preventDefault()
    setSearched(
      rows.filter((row) => {
        const day = row.loggedAt.slice(0, 10)
        if (from && day < from) return false
        if (to && day > to) return false
        return true
      }),
    )
  }

  const filtered = useMemo(
    () =>
      filterRows(searched, filters, {
        loggedAt: (r) => r.loggedAt,
        issuedAt: (r) => r.issuedAt ?? '',
        returnedAt: (r) => r.returnedAt ?? '',
        cardName: (r) => r.cardName || r.cardNo || '',
        visitType: (r) => r.visitType ?? '',
        company: (r) => r.company ?? '',
        title: (r) => r.title ?? '',
        visitorName: (r) => r.visitorName,
        host: (r) => r.host ?? '',
      }),
    [searched, filters],
  )

  const periodStats = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of filtered) {
      const day = row.loggedAt.slice(0, 10)
      map.set(day, (map.get(day) || 0) + 1)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const periodTotal = filtered.length
  const maxDaily = Math.max(1, ...periodStats.map(([, n]) => n))

  return (
    <>
      <h1>방문자 출입이력</h1>
      <div className="access-layout">
        <div className="access-main">
          <form className="search-form admin-search-bar" onSubmit={onSearch} aria-label="검색조건">
            <span className="search-label">검색조건</span>
            <div className="date-range-field">
              <span>방문일</span>
              <input
                type="date"
                aria-label="방문일 시작"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <span aria-hidden="true">~</span>
              <input
                type="date"
                aria-label="방문일 종료"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <button type="submit">검색</button>
          </form>
          <AdminGridToolbar
            onExcel={() => downloadAccessLogsExcel(filtered)}
            onRefresh={refresh}
            onResetColumns={() => setFilters({})}
          />
          <p className="grid-group-hint">그룹화 할 열 머리글을 여기로 끌어옵니다.</p>
          <div className="visitor-table-wrap">
            <table className="visitor-table admin-data-grid">
              <thead>
                <tr>
                  <th scope="col">인증일시</th>
                  <th scope="col">발급일시</th>
                  <th scope="col">반납일시</th>
                  <th scope="col">카드이름</th>
                  <th scope="col">방문유형</th>
                  <th scope="col">방문업체</th>
                  <th scope="col">직급</th>
                  <th scope="col">방문자</th>
                  <th scope="col">찾아갈분</th>
                </tr>
                <AdminColumnFilters
                  defs={FILTER_DEFS}
                  values={filters}
                  onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
                />
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td>{row.loggedAt}</td>
                    <td>{row.issuedAt || '-'}</td>
                    <td>{row.returnedAt || '-'}</td>
                    <td>{row.cardName || row.cardNo || '-'}</td>
                    <td>{row.visitType || '-'}</td>
                    <td>{row.company || '-'}</td>
                    <td>{row.title || '-'}</td>
                    <td>{row.visitorName}</td>
                    <td>{row.host || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="grid-page-info">페이지 1 of 1 ({filtered.length}건)</p>
        </div>

        <aside className="access-charts" aria-label="출입현황 그래프">
          <section className="chart-card" aria-label="기간별 총 출입현황">
            <h2>기간별 총 출입현황</h2>
            <p className="chart-total">{periodTotal}건</p>
            <div className="chart-bars" role="img" aria-label={`기간 합계 ${periodTotal}건`}>
              {periodStats.map(([day, n]) => (
                <div key={day} className="chart-bar-col" title={`${day}: ${n}`}>
                  <div className="chart-bar" style={{ height: `${(n / maxDaily) * 100}%` }} />
                  <span>{day.slice(8)}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="chart-card" aria-label="일별 출입현황">
            <h2>일별 출입현황</h2>
            <p className="chart-axis-label">출입인원</p>
            <svg className="chart-line" viewBox="0 0 280 140" role="img" aria-label="일별 출입 선그래프">
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="30" x2="270" y1={20 + i * 30} y2={20 + i * 30} stroke="#e5e7eb" />
              ))}
              {periodStats.length > 1 ? (
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  points={periodStats
                    .map(([, n], i) => {
                      const x = 30 + (i / Math.max(1, periodStats.length - 1)) * 240
                      const y = 110 - (n / maxDaily) * 90
                      return `${x},${y}`
                    })
                    .join(' ')}
                />
              ) : null}
              {periodStats.map(([, n], i) => {
                const x = 30 + (i / Math.max(1, periodStats.length - 1)) * 240
                const y = 110 - (n / maxDaily) * 90
                return <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />
              })}
            </svg>
          </section>
        </aside>
      </div>
    </>
  )
}
