import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppToast from '../components/AppToast'
import WizardFooter from '../components/WizardFooter'
import WizardStepper from '../components/WizardStepper'
import { useAppToast } from '../hooks/useAppToast'
import { readDraft, writeDraft } from '../store/applyDraft'

const LOCATIONS_LEFT = [
  '올인원제련소 경비실',
  '올인원제련소 본관',
  '올인원제련소 파워룸',
  '올인원제련소 공정설비',
  '올인원제련소 기타구역',
] as const

const LOCATIONS_RIGHT = [
  '1공장 경비실',
  '1공장 사무실',
  '1공장 제어실(C/R)',
  '1공장 공정설비',
  '1공장 기타구역',
] as const

const PURPOSES = [
  '회의참석 및 업무협의(심사 등)',
  '물품 반입/반출, 납품 등',
  '공사/작업,유지보수,A/S등',
  '기타(직접 입력)',
] as const

const VISIT_TYPES = ['방문(일반,협의,심사)', '단기근로', '정기출입', '공사(납품)'] as const

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function VisitInfo() {
  const navigate = useNavigate()
  const initial = readDraft()
  const [host, setHost] = useState(initial.host)
  const [location, setLocation] = useState(initial.location)
  const [purpose, setPurpose] = useState(initial.purpose)
  const [purposeOther, setPurposeOther] = useState(initial.purposeOther)
  const [visitType, setVisitType] = useState(initial.visitType || VISIT_TYPES[0])
  const [visitStart, setVisitStart] = useState(initial.visitStart || todayISO())
  const [visitEnd, setVisitEnd] = useState(initial.visitEnd || todayISO())
  const [hostError, setHostError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const { message, showToast, clearToast } = useAppToast()

  function openHostSearch() {
    setModalOpen(true)
    setSearchQuery(host)
    setSearched(false)
  }

  function runSearch() {
    setSearched(true)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!host.trim()) {
      setHostError('찾아가시는 분을 입력하세요.')
      return
    }
    if (!location) {
      showToast('방문 장소를 선택해 주세요.')
      return
    }
    if (!purpose) {
      showToast('방문 목적을 선택해 주세요.')
      return
    }
    if (purpose === '기타(직접 입력)' && !purposeOther.trim()) {
      showToast('기타 방문 목적을 입력해 주세요.')
      return
    }
    writeDraft({
      host: host.trim(),
      location,
      purpose,
      purposeOther: purposeOther.trim(),
      visitType,
      visitStart,
      visitEnd,
    })
    navigate('/apply/visitor-info')
  }

  return (
    <main className="wizard-page visitor-dark">
      <WizardStepper current={3} />
      <h1>방문 정보</h1>

      <form className="visit-form visit-info-form" onSubmit={onSubmit}>
        <div className="field-block">
          <label htmlFor="host">찾아가시는 분</label>
          <div className="host-row">
            <input
              id="host"
              name="host"
              value={host}
              onChange={(e) => {
                setHost(e.target.value)
                setHostError('')
              }}
              placeholder="찾아갈 분을 입력하거나 조회하세요"
            />
            <button type="button" className="btn-search-host" onClick={openHostSearch}>
              조회
            </button>
          </div>
          {hostError ? (
            <p className="field-error" role="alert">
              ⚠️ {hostError}
            </p>
          ) : null}
        </div>

        <fieldset className="field-block">
          <legend>방문 장소</legend>
          <div className="radio-grid two-col">
            <div>
              {LOCATIONS_LEFT.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="location"
                    value={item}
                    checked={location === item}
                    onChange={() => setLocation(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
            <div>
              {LOCATIONS_RIGHT.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="location"
                    value={item}
                    checked={location === item}
                    onChange={() => setLocation(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="field-block">
          <legend>방문 목적</legend>
          <div className="radio-grid two-col">
            {PURPOSES.map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="purpose"
                  value={item}
                  checked={purpose === item}
                  onChange={() => setPurpose(item)}
                />
                {item}
              </label>
            ))}
          </div>
          {purpose === '기타(직접 입력)' ? (
            <label className="purpose-other">
              기타 목적
              <input
                name="purposeOther"
                value={purposeOther}
                onChange={(e) => setPurposeOther(e.target.value)}
              />
            </label>
          ) : null}
        </fieldset>

        <fieldset className="field-block">
          <legend>방문 유형</legend>
          <div className="radio-grid two-col">
            {VISIT_TYPES.map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="visitType"
                  value={item}
                  checked={visitType === item}
                  onChange={() => setVisitType(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="date-row">
          <label>
            방문 시작
            <input
              name="visitStart"
              type="date"
              value={visitStart}
              onChange={(e) => setVisitStart(e.target.value)}
              required
            />
          </label>
          <label>
            방문 종료
            <input
              name="visitEnd"
              type="date"
              value={visitEnd}
              onChange={(e) => setVisitEnd(e.target.value)}
              required
            />
          </label>
        </div>
        <p className="field-hint">방문(일반,협의,심사) 신청은 최대 30일까지 가능합니다.</p>

        <div className="wizard-actions consent-bottom">
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
            취소
          </button>
          <button type="submit" className="btn-primary">
            다음 : 방문자 정보
          </button>
        </div>
      </form>

      {modalOpen ? (
        <div className="host-modal-backdrop" role="presentation">
          <div className="host-modal" role="dialog" aria-modal="true" aria-labelledby="host-modal-title">
            <h2 id="host-modal-title">찾아갈 분 조회</h2>
            <div className="host-search-row">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="사원 검색"
                placeholder="성명 검색"
              />
              <button type="button" className="btn-search-purple" onClick={runSearch} aria-label="검색">
                🔍
              </button>
            </div>
            <div className="host-search-result">
              {searched ? <p>검색된 사원이 없습니다.</p> : <p>성명을 입력 후 검색하세요.</p>}
            </div>
            <div className="host-manual">
              <label>
                직접 입력
                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="찾아가시는 분 성명"
                />
              </label>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (host.trim()) {
                    setHostError('')
                    setModalOpen(false)
                  } else {
                    setHostError('찾아가시는 분을 입력하세요.')
                  }
                }}
              >
                적용
              </button>
            </div>
            <button type="button" className="btn-close-modal" onClick={() => setModalOpen(false)}>
              CLOSE
            </button>
          </div>
        </div>
      ) : null}

      <WizardFooter />
      <AppToast message={message} onClose={clearToast} />
    </main>
  )
}
