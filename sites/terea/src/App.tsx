import { Route, Routes } from 'react-router-dom'
import ApplicationLookup from './pages/ApplicationLookup'
import PrivacyConsent from './pages/PrivacyConsent'
import SafetyPledge from './pages/SafetyPledge'
import VisitInfo from './pages/VisitInfo'
import VisitMain from './pages/VisitMain'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VisitMain />} />
      <Route path="/lookup" element={<ApplicationLookup />} />
      <Route path="/apply/privacy" element={<PrivacyConsent />} />
      <Route path="/apply/safety" element={<SafetyPledge />} />
      <Route path="/apply/visit-info" element={<VisitInfo />} />
    </Routes>
  )
}
