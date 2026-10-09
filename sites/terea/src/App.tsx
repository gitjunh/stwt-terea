import { Route, Routes } from 'react-router-dom'
import VisitMain from './pages/VisitMain'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VisitMain />} />
    </Routes>
  )
}
