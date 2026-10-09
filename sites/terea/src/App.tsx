import { Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import ApplicationComplete from './pages/ApplicationComplete'
import ApplicationLookup from './pages/ApplicationLookup'
import PrivacyConsent from './pages/PrivacyConsent'
import SafetyPledge from './pages/SafetyPledge'
import VisitInfo from './pages/VisitInfo'
import VisitMain from './pages/VisitMain'
import VisitApproval from './pages/VisitApproval'
import VisitorStatus from './pages/VisitorStatus'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VisitMain />} />
      <Route path="/lookup" element={<ApplicationLookup />} />
      <Route path="/apply/privacy" element={<PrivacyConsent />} />
      <Route path="/apply/safety" element={<SafetyPledge />} />
      <Route path="/apply/visit-info" element={<VisitInfo />} />
      <Route path="/apply/complete" element={<ApplicationComplete />} />
      <Route path="/manager/login" element={<AdminLogin />} />
      <Route path="/manager/approvals" element={<VisitApproval />} />
      <Route path="/manager/visitors" element={<VisitorStatus />} />
    </Routes>
  )
}
