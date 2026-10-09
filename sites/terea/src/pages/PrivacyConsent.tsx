import { useState } from 'react'
import { Link } from 'react-router-dom'
import WizardStepper from '../components/WizardStepper'

const REQUIRED = [
  { id: 'collect', label: '개인정보 수집 및 이용 (필수)' },
  { id: 'visit', label: '방문기록 관리 및 출입 확인 (필수)' },
  { id: 'retain', label: '개인정보 보관 안내 확인 (필수)' },
] as const

export default function PrivacyConsent() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    collect: false,
    visit: false,
    retain: false,
  })

  return (
    <main className="wizard-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로</Link>
      </header>
      <WizardStepper current={1} />
      <h1>개인정보 수집·이용 동의</h1>
      <p>방문예약 서비스 이용을 위해 필수 동의 항목을 확인하세요.</p>
      <ul className="consent-list">
        {REQUIRED.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={checked[item.id]}
                onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
              />
              {item.label}
            </label>
          </li>
        ))}
      </ul>
      <div className="wizard-actions">
        <button type="button">동의하고 다음</button>
      </div>
    </main>
  )
}
