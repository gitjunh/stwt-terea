import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WizardFooter from '../components/WizardFooter'
import WizardStepper from '../components/WizardStepper'
import { clearDraft, readDraft, writeDraft } from '../store/applyDraft'
import { saveApplication } from '../store/applications'

export default function VisitorInfo() {
  const navigate = useNavigate()
  const draft = readDraft()
  const [company, setCompany] = useState(draft.company)
  const [name, setName] = useState(draft.name)
  const [phone, setPhone] = useState(draft.phone)
  const [vehicle, setVehicle] = useState(draft.vehicle)
  const [facePhotoName, setFacePhotoName] = useState(draft.facePhotoName)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const current = writeDraft({
      company: company.trim(),
      name: name.trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim(),
      facePhotoName,
    })

    if (!current.host || !current.location || !current.purpose || !current.visitType) {
      window.alert('방문 정보가 없습니다. 이전 단계로 돌아가 주세요.')
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
      purpose: `${purposeLabel} / ${current.location}`,
      host: current.host,
      vehicle: current.vehicle || undefined,
      vehicleStatus: current.vehicle ? '대기' : undefined,
      facePhotoName: current.facePhotoName || undefined,
    })
    clearDraft()
    navigate('/apply/complete')
  }

  return (
    <main className="wizard-page visitor-dark">
      <WizardStepper current={4} />
      <h1>방문자 정보</h1>
      <p>방문자의 신원·연락처 정보를 입력해 주세요.</p>

      <form className="visit-form" onSubmit={onSubmit}>
        <label>
          방문업체/소속 *
          <input
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </label>
        <label>
          방문자 성명 *
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          휴대전화 *
          <input
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
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
        <section className="face-photo">
          <h2>얼굴 사진 (안면 인식용)</h2>
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
    </main>
  )
}
