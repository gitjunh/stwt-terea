import { Link } from 'react-router-dom'
import WizardStepper from '../components/WizardStepper'

/** S9 이동 대상. 확인·동의 UI는 S10에서 채운다. */
export default function SafetyPledge() {
  return (
    <main className="wizard-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로</Link>
      </header>
      <WizardStepper current={2} />
      <h1>안전서약서</h1>
    </main>
  )
}
