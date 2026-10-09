export type QrNotice = {
  applicationId: string
  name: string
  phone: string
  code: string
  message: string
  createdAt: string
}

const STORAGE_KEY = 'terea-qr-notices'

function readAll(): QrNotice[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as QrNotice[]
  } catch {
    return []
  }
}

export function listQrNotices(): QrNotice[] {
  return readAll()
}

export function recordQrNotice(input: {
  applicationId: string
  name: string
  phone: string
}): QrNotice {
  const notice: QrNotice = {
    applicationId: input.applicationId,
    name: input.name,
    phone: input.phone,
    code: `TEREA-QR-${input.applicationId}`,
    message: '방문 승인 QR 안내(로컬 표시, 실SMS 대체)',
    createdAt: new Date().toISOString(),
  }
  const all = readAll().filter((item) => item.applicationId !== input.applicationId)
  all.unshift(notice)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return notice
}

export function findQrNotices(name: string, phone: string): QrNotice[] {
  const normalizedPhone = phone.replace(/\D/g, '')
  return readAll().filter(
    (item) => item.name === name.trim() && item.phone.replace(/\D/g, '') === normalizedPhone,
  )
}
