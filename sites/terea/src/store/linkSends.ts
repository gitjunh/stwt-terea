export type LinkSendRecord = {
  id: string
  phone: string
  message: string
  sentAt: string
}

const STORAGE_KEY = 'terea-link-sends'

const DEFAULT_MESSAGE =
  'terea 방문신청 링크입니다. https://localhost/apply/privacy 에서 신청해 주세요.'

export function getDefaultLinkMessage(): string {
  return DEFAULT_MESSAGE
}

function readAll(): LinkSendRecord[] {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as LinkSendRecord[]
  } catch {
    return []
  }
}

export function recordLinkSend(phone: string, message = DEFAULT_MESSAGE): LinkSendRecord {
  const record: LinkSendRecord = {
    id: `link-${Date.now()}`,
    phone: phone.trim(),
    message,
    sentAt: new Date().toISOString(),
  }
  const all = readAll()
  all.push(record)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return record
}
