import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WizardStepper from '../components/WizardStepper'
import { saveApplication } from '../store/applications'

export default function VisitInfo() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [visitAt, setVisitAt] = useState('')
  const [visitType, setVisitType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [host, setHost] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [facePhotoName, setFacePhotoName] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    saveApplication({
      id: `app-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      status: '대기',
      company: company.trim(),
      visitAt,
      visitType,
      purpose: purpose.trim(),
      host: host.trim(),
      vehicle: vehicle.trim() || undefined,
      facePhotoName: facePhotoName || undefined,
    })
    navigate('/apply/complete')
  }

  return (
    <main className="wizard-page">
      <header className="site-header">
        <p className="brand">terea</p>
        <Link to="/">메인으로</Link>
      </header>
      <WizardStepper current={3} />
      <h1>방문정보 입력</h1>
      <p>방문에 필요한 정보를 입력해 주세요.</p>
      <form className="visit-form" onSubmit={onSubmit}>
        <label>
          방문업체/소속 *
          <input name="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
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
          방문일/시간 *
          <input
            name="visitAt"
            type="datetime-local"
            value={visitAt}
            onChange={(e) => setVisitAt(e.target.value)}
            required
          />
        </label>
        <label>
          방문유형 *
          <select
            name="visitType"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            required
          >
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
          <input name="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
        </label>
        <label>
          찾아갈 분 *
          <input name="host" value={host} onChange={(e) => setHost(e.target.value)} required />
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
        </section>
        <div className="wizard-actions">
          <button type="submit">신청 완료</button>
        </div>
      </form>
    </main>
  )
}
