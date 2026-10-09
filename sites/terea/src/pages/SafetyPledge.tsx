import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WizardFooter from '../components/WizardFooter'
import WizardStepper from '../components/WizardStepper'

const PLEDGE_CLAUSES = [
  '공장 내부 이동 시, 항상 안전모, 안전화 착용 및 보안면(경)을 지참한다.',
  '사고 발생 가능성이 높은 위험작업은 작업허가서를 발행, 관리감독자 허가 하에 작업을 진행한다.',
  '유해화학물질 취급 작업 시, 안전모, 보안면(경), 내산복, 내산화 착용을 철저히 한다.',
  '밀폐공간 작업 시, 환기실시 및 가스농도 측정 실시하고 감시인 및 공기호흡기 배치 등 안전확보를 철저히 한다.',
  '고소 작업 시, 추락방지 조치를 하고 안전벨트 착용 및 안전고리 체결을 하고 작업을 한다. (2m 이상 사다리 작업 금지)',
  '회전체 및 전기 시설의 점검, 보수 시, 전원 차단 조치를 한다.(LOTO 표지 부착)',
  '회전 및 작동 중인 설비에는 신체를 접촉하지 않는다.',
  '보호커버 등 방호장치는 임의로 해체하지 않는다.',
  '칼 사용, 베임 위험이 있는 작업 시, 내절단 장갑을 착용한다.',
  '작업장 주위는 내가 항상 정리정돈을 실시한다.',
  '쓰레기를 아무 곳에나 버리지 않고 폐기물은 지정된 장소에 처리한다.',
  '지정된 흡연장소 외의는 절대 금연한다.',
  '사내 운전은 서행하며 이동속도 20km 미만 운전을 준수한다.',
  '내 자신의 안전뿐 아니라 주변 동료의 안전까지 지켜준다.',
] as const

type ConsentValue = 'agree' | 'disagree' | null

export default function SafetyPledge() {
  const navigate = useNavigate()
  const [consent, setConsent] = useState<ConsentValue>(null)

  function onAgree() {
    if (consent !== 'agree') {
      window.alert('안전서약서에 동의해 주세요.')
      return
    }
    navigate('/apply/visit-info')
  }

  function onDisagree() {
    window.alert('동의하지 않으면 방문 신청을 진행할 수 없습니다.')
  }

  return (
    <main className="wizard-page visitor-dark">
      <WizardStepper current={2} />
      <h1>안전서약서 동의</h1>

      <section className="pledge-body" aria-label="서약 본문">
        <p className="pledge-intro">
          terea(주) 전 임직원은 상호 신뢰를 바탕으로 무재해 달성 및 안전사고 예방에 최선을 다하고
          안전문화정착을 최우선 할 것이며 아래의 안전규정을 준수하여 이행 할 것을 서약합니다.
        </p>
        <ol className="pledge-clauses">
          {PLEDGE_CLAUSES.map((clause, index) => (
            <li key={clause}>
              {index + 1}. {clause}
            </li>
          ))}
        </ol>
      </section>

      <fieldset className="consent-radios">
        <legend className="visually-hidden">안전서약서 동의 선택</legend>
        <label>
          <input
            type="radio"
            name="safety"
            checked={consent === 'agree'}
            onChange={() => setConsent('agree')}
          />
          동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="safety"
            checked={consent === 'disagree'}
            onChange={() => setConsent('disagree')}
          />
          동의하지 않습니다.
        </label>
      </fieldset>

      <div className="wizard-actions consent-bottom">
        <button type="button" className="btn-secondary" onClick={onDisagree}>
          동의하지 않습니다
        </button>
        <button type="button" className="btn-primary" onClick={onAgree}>
          동의합니다
        </button>
      </div>

      <WizardFooter />
    </main>
  )
}
