export type ApplyDraft = {
  host: string
  /** 원본과 동일 — 방문 장소 다중 선택 */
  locations: string[]
  purpose: string
  purposeOther: string
  visitType: string
  visitStart: string
  visitEnd: string
  company: string
  title: string
  name: string
  phone: string
  email: string
  isForeigner: boolean
  vehicle: string
  facePhotoName: string
}

const STORAGE_KEY = 'terea-apply-draft'

export const EMPTY_DRAFT: ApplyDraft = {
  host: '',
  locations: [],
  purpose: '',
  purposeOther: '',
  visitType: '',
  visitStart: '',
  visitEnd: '',
  company: '',
  title: '',
  name: '',
  phone: '',
  email: '',
  isForeigner: false,
  vehicle: '',
  facePhotoName: '',
}

export function readDraft(): ApplyDraft {
  if (typeof window === 'undefined') return { ...EMPTY_DRAFT }
  const raw = window.sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return { ...EMPTY_DRAFT }
  try {
    const parsed = JSON.parse(raw) as Partial<ApplyDraft> & { location?: string }
    const locations =
      Array.isArray(parsed.locations) && parsed.locations.length > 0
        ? parsed.locations
        : parsed.location
          ? [parsed.location]
          : []
    return { ...EMPTY_DRAFT, ...parsed, locations }
  } catch {
    return { ...EMPTY_DRAFT }
  }
}

export function writeDraft(patch: Partial<ApplyDraft>): ApplyDraft {
  const next = { ...readDraft(), ...patch }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearDraft(): void {
  window.sessionStorage.removeItem(STORAGE_KEY)
}
