import { Link } from 'react-router-dom'
import WizardStepper from '../components/WizardStepper'

export default function VisitInfo() {
  return (
    <main className="wizard-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로</Link>
      </header>
      <WizardStepper current={3} />
      <h1>방문정보 입력</h1>
      <p>방문에 필요한 정보를 입력해 주세요.</p>
    </main>
  )
}
