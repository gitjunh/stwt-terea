import { useEffect } from 'react'

const QUERY = '(max-width: 720px)'

export function useMobileLayout() {
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const apply = () => {
      document.documentElement.dataset.viewport = mq.matches ? 'mobile' : 'desktop'
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      delete document.documentElement.dataset.viewport
    }
  }, [])
}
