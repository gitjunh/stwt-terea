import { useEffect, useState } from 'react'

const STORAGE_KEY = 'terea-dark-mode'

export function readStoredDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export function applyTheme(dark: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

/** 방문 메인 Dark Mode 토글. 관리 셸은 CSS로 분리. */
export function useDarkMode() {
  const [dark, setDark] = useState(() => readStoredDarkMode())

  useEffect(() => {
    applyTheme(dark)
    window.localStorage.setItem(STORAGE_KEY, dark ? '1' : '0')
  }, [dark])

  return {
    dark,
    toggle: () => setDark((value) => !value),
    themeClass: dark ? 'visitor-dark' : 'visitor-light',
  }
}

/** 토글 없는 방문 페이지 — 저장된 테마 클래스를 맞춘다. */
export function useVisitorThemeClass() {
  const [themeClass, setThemeClass] = useState(() =>
    readStoredDarkMode() ? 'visitor-dark' : 'visitor-light',
  )

  useEffect(() => {
    const dark = readStoredDarkMode()
    applyTheme(dark)
    setThemeClass(dark ? 'visitor-dark' : 'visitor-light')
  }, [])

  return themeClass
}
