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
      <form className="visit-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          방문업체/소속 *
          <input name="company" required />
        </label>
        <label>
          방문자 성명 *
          <input name="name" required />
        </label>
        <label>
          휴대전화 *
          <input name="phone" type="tel" required />
        </label>
        <label>
          방문일/시간 *
          <input name="visitAt" type="datetime-local" required />
        </label>
        <label>
          방문유형 *
          <select name="visitType" required defaultValue="">
            <option value="" disabled>
              선택
            </option>
            <option value="일반">일반 방문</option>
            <option value="업무">업무 방문</option>
            <option value="공사">공사/작업</option>
          </select>
        </label>
        <label>
          방문목적/장소 *
          <input name="purpose" required />
        </label>
        <label>
          찾아갈 분 *
          <input name="host" required />
        </label>
      </form>
    </main>
  )
}
