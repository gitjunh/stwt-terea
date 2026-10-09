import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppToast from '../components/AppToast'
import WizardFooter from '../components/WizardFooter'
import WizardStepper from '../components/WizardStepper'
import { useAppToast } from '../hooks/useAppToast'
import { useVisitorThemeClass } from '../hooks/useDarkMode'
import { clearDraft, readDraft, writeDraft } from '../store/applyDraft'
import { saveApplication } from '../store/applications'

export default function VisitorInfo() {
  const navigate = useNavigate()
  const themeClass = useVisitorThemeClass()
  const draft = readDraft()
  const [company, setCompany] = useState(draft.company)
  const [title, setTitle] = useState(draft.title)
  const [name, setName] = useState(draft.name)
  const [phone, setPhone] = useState(draft.phone)
  const [email, setEmail] = useState(draft.email)
  const [isForeigner, setIsForeigner] = useState(draft.isForeigner)
  const [vehicle, setVehicle] = useState(draft.vehicle)
  const [facePhotoName, setFacePhotoName] = useState(draft.facePhotoName)
  const { message, showToast, clearToast } = useAppToast()

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const current = writeDraft({
      company: company.trim(),
      title: title.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isForeigner,
      vehicle: vehicle.trim(),
      facePhotoName,
    })

    if (
      !current.host ||
      current.locations.length === 0 ||
      !current.purpose ||
      !current.visitType
    ) {
      showToast('방문 정보가 없습니다. 이전 단계로 돌아가 주세요.')
      navigate('/apply/visit-info')
      return
    }

    const purposeLabel =
      current.purpose === '기타(직접 입력)'
        ? current.purposeOther || current.purpose
        : current.purpose

    saveApplication({
      id: `app-${Date.now()}`,
      name: current.name,
      phone: current.phone,
      status: '대기',
      company: current.company,
      visitAt: `${current.visitStart}T09:00`,
      visitType: current.visitType,
      purpose: `${purposeLabel} / ${current.locations.join(', ')}`,
      host: current.host,
      vehicle: current.vehicle || undefined,
      vehicleStatus: current.vehicle ? '대기' : undefined,
      facePhotoName: current.facePhotoName || undefined,
    })
    clearDraft()
    navigate('/apply/complete')
  }

  return (
    <main className={`wizard-page ${themeClass}`}>
      <WizardStepper current={4} />
      <h1>방문자 정보</h1>

      <form className="visit-form" onSubmit={onSubmit}>
        <section className="face-photo">
          <h2>방문자 사진</h2>
          <label>
            사진 등록
            <input
              name="facePhoto"
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => setFacePhotoName(e.target.files?.[0]?.name ?? '')}
            />
          </label>
          {facePhotoName ? <p className="field-hint">등록: {facePhotoName}</p> : null}
        </section>

        <label>
          소속 회사 *
          <input
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </label>
        <label>
          직급
          <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={isForeigner}
            onChange={(e) => setIsForeigner(e.target.checked)}
          />
          외국인
        </label>
        <label>
          성명 *
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          휴대전화번호 *
          <input
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <label>
          이메일
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          차량번호
          <input
            name="vehicle"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            placeholder="차량 이용 시 입력"
          />
        </label>

        <div className="wizard-actions consent-bottom">
          <button type="button" className="btn-secondary" onClick={() => navigate('/apply/visit-info')}>
            이전
          </button>
          <button type="submit" className="btn-primary">
            신청 완료
          </button>
        </div>
      </form>

      <WizardFooter />
      <AppToast message={message} onClose={clearToast} />
    </main>
  )
}
