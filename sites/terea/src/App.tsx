import { Route, Routes } from 'react-router-dom'
import ApplicationLookup from './pages/ApplicationLookup'
import VisitMain from './pages/VisitMain'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VisitMain />} />
      <Route path="/lookup" element={<ApplicationLookup />} />
    </Routes>
  )
}
