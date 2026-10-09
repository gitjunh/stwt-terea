import { useEffect, useState } from 'react'

const STORAGE_KEY = 'terea-dark-mode'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    window.localStorage.setItem(STORAGE_KEY, dark ? '1' : '0')
  }, [dark])

  return {
    dark,
    toggle: () => setDark((value) => !value),
  }
}
