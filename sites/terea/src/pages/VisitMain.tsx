import { Link } from 'react-router-dom'

const ENTRY_STEPS = [
  { step: 1, label: '방문신청', detail: '개인정보동의·방문자정보' },
  { step: 2, label: '출입승인', detail: '담당자 승인·차량 승인' },
  { step: 3, label: 'QRCode인식', detail: '승인후 전송' },
  { step: 4, label: '방문증발급', detail: '경비실 방문' },
] as const

export default function VisitMain() {
  return (
    <main className="visit-main">
      <header className="site-header">
        <p className="brand">terea</p>
        <p className="context">방문 예약</p>
      </header>
      <section className="hero">
        <h1>방문을 환영합니다.</h1>
        <nav className="main-ctas" aria-label="주요 진입">
          <Link to="/apply/privacy">방문신청</Link>
          <Link to="/lookup">신청 조회</Link>
        </nav>
      </section>
      <section className="entry-steps" aria-label="방문자 출입절차">
        <h2>방문자 출입절차</h2>
        <ol className="step-list">
          {ENTRY_STEPS.map((item) => (
            <li key={item.step} className="step-item">
              <span className="step-number">STEP {item.step}</span>
              <span className="step-label">{item.label}</span>
              <span className="step-detail">{item.detail}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
