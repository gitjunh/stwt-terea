import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useMobileLayout } from './hooks/useMobileLayout'
import AdminLogin from './pages/AdminLogin'
import ApplicationComplete from './pages/ApplicationComplete'
import ApplicationLookup from './pages/ApplicationLookup'
import PrivacyConsent from './pages/PrivacyConsent'
import SafetyPledge from './pages/SafetyPledge'
import VehicleApproval from './pages/VehicleApproval'
import VisitApproval from './pages/VisitApproval'
import VisitInfo from './pages/VisitInfo'
import VisitMain from './pages/VisitMain'
import VisitorInfo from './pages/VisitorInfo'
import VisitorStatus from './pages/VisitorStatus'

const BRAND_TITLE = 'terea 방문 예약'
const BRAND_DESCRIPTION = 'terea 방문 예약'

export default function App() {
  useMobileLayout()

  useEffect(() => {
    document.title = BRAND_TITLE
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', BRAND_DESCRIPTION)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<VisitMain />} />
      <Route path="/lookup" element={<ApplicationLookup />} />
      <Route path="/apply/privacy" element={<PrivacyConsent />} />
      <Route path="/apply/safety" element={<SafetyPledge />} />
      <Route path="/apply/visit-info" element={<VisitInfo />} />
      <Route path="/apply/visitor-info" element={<VisitorInfo />} />
      <Route path="/apply/complete" element={<ApplicationComplete />} />
      <Route path="/manager/login" element={<AdminLogin />} />
      <Route path="/manager/approvals" element={<VisitApproval />} />
      <Route path="/manager/vehicles" element={<VehicleApproval />} />
      <Route path="/manager/visitors" element={<VisitorStatus />} />
    </Routes>
  )
}
