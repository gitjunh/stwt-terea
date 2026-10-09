import { Link } from 'react-router-dom'
import {
  IconLookup,
  IconStep1,
  IconStep2,
  IconStep3,
  IconStep4,
  IconVisitApply,
} from '../components/MainIcons'
import { useDarkMode } from '../hooks/useDarkMode'

const ENTRY_STEPS = [
  {
    step: 1,
    label: '방문신청',
    details: ['개인정보동의', '방문자정보'],
    Icon: IconStep1,
  },
  {
    step: 2,
    label: '출입승인',
    details: ['담당자 승인', '차량 승인'],
    Icon: IconStep2,
  },
  {
    step: 3,
    label: 'QRCode인식',
    details: ['승인후 전송'],
    Icon: IconStep3,
  },
  {
    step: 4,
    label: '방문증발급',
    details: ['경비실 방문'],
    Icon: IconStep4,
  },
] as const

export default function VisitMain() {
  const { dark, toggle } = useDarkMode()

  return (
    <main className="visit-main visitor-dark">
      <header className="site-header visit-main-header">
        <p className="brand">terea</p>
        <p className="context">방문 예약</p>
        <button type="button" className="theme-toggle" onClick={toggle} aria-pressed={dark}>
          Dark Mode
        </button>
      </header>

      <section className="hero main-action-cards" aria-label="주요 진입">
        <h1 className="visually-hidden">방문을 환영합니다.</h1>
        <nav className="main-ctas" aria-label="주요 진입">
          <Link to="/apply/privacy" className="main-card">
            <IconVisitApply />
            <span className="main-card-label">방문신청</span>
          </Link>
          <Link to="/lookup" className="main-card">
            <IconLookup />
            <span className="main-card-label">신청 조회</span>
          </Link>
        </nav>
      </section>

      <section className="entry-steps" aria-label="방문자 출입절차">
        <ol className="step-list">
          {ENTRY_STEPS.map((item) => (
            <li key={item.step} className="step-item">
              <span className="step-number">STEP {item.step}</span>
              <item.Icon />
              <span className="step-label">{item.label}</span>
              {item.details.map((detail) => (
                <span key={detail} className="step-detail">
                  {detail}
                </span>
              ))}
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
