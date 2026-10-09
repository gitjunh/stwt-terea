import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WizardStepper from '../components/WizardStepper'

export default function SafetyPledge() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)

  return (
    <main className="wizard-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로</Link>
      </header>
      <WizardStepper current={2} />
      <h1>안전서약서 확인</h1>
      <p>방문 중 지켜야 할 안전·보안 준수사항을 확인·동의해 주세요.</p>
      <section className="pledge-body" aria-label="서약 본문">
        <p>
          방문 중 시설 안전수칙과 보안 지침을 준수하며, 안내받지 않은 구역에 출입하지 않겠습니다.
          비상 시 안내 요원의 지시에 따르겠습니다.
        </p>
        <aside className="pledge-guide">
          <p>서약 내용 읽기</p>
          <p>방문 중 준수</p>
          <p>동의 후 진행</p>
        </aside>
      </section>
      <label className="pledge-agree">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        내용 확인 후 동의
      </label>
      <div className="wizard-actions">
        <button
          type="button"
          disabled={!agreed}
          onClick={() => navigate('/apply/visit-info')}
        >
          동의 후 진행
        </button>
      </div>
    </main>
  )
}
