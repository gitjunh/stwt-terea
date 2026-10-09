import { useState } from 'react'
import AdminShell from '../components/AdminShell'
import {
  listVehicleApplications,
  updateVehicleStatus,
  type VisitApplication,
} from '../store/applications'

export default function VehicleApproval() {
  return (
    <AdminShell title="차량 승인">
      <VehicleApprovalContent />
    </AdminShell>
  )
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
    <>
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
                <td>{row.vehicleStatus === '승인' ? '차량승인' : (row.vehicleStatus ?? '대기')}</td>
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
    </>
  )
}
