import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import AdminNav from '../components/AdminNav'
import { clearAdminSession, isAdminLoggedIn } from '../auth/adminSession'
import {
  listVehicleApplications,
  updateVehicleStatus,
  type VisitApplication,
} from '../store/applications'

export default function VehicleApproval() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/manager/login" replace />
  }

  return <VehicleApprovalContent />
}

function VehicleApprovalContent() {
  const [rows, setRows] = useState<VisitApplication[]>(() => listVehicleApplications())

  function refresh() {
    setRows(listVehicleApplications())
  }

  function onApprove(id: string) {
    updateVehicleStatus(id, '승인')
    refresh()
  }

  return (
    <main className="admin-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <p className="context">방문자 관리</p>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => {
            clearAdminSession()
            window.location.assign('/manager/login')
          }}
        >
          로그아웃
        </button>
      </header>
      <AdminNav />
      <h1>차량 승인</h1>
      <div className="visitor-table-wrap">
        <table className="visitor-table">
          <thead>
            <tr>
              <th scope="col">방문자</th>
              <th scope="col">차량번호</th>
              <th scope="col">차량승인상태</th>
              <th scope="col">처리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.vehicle}</td>
                <td>
                  {row.vehicleStatus === '승인' ? '차량승인' : (row.vehicleStatus ?? '대기')}
                </td>
                <td>
                  {row.vehicleStatus !== '승인' ? (
                    <button type="button" onClick={() => onApprove(row.id)}>
                      차량 승인
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
