import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

afterEach(() => {
  document.documentElement.dataset.theme = 'light'
  window.localStorage.removeItem('terea-dark-mode')
})

describe('R17: 방문자 Dark Mode가 본문 UI 전체에 적용', () => {
  it('기본(라이트)에서는 visitor-light, Dark Mode 켜면 visitor-dark로 본문이 바뀐다', async () => {
    const user = userEvent.setup()
    const { container } = renderWithRouter(<App />)
    const main = container.querySelector('main.visit-main')
    expect(main).toHaveClass('visitor-light')
    expect(main).not.toHaveClass('visitor-dark')

    await user.click(screen.getByRole('button', { name: /Dark Mode/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(container.querySelector('main.visit-main')).toHaveClass('visitor-dark')
    expect(container.querySelector('main.visit-main')).not.toHaveClass('visitor-light')

    await user.click(screen.getByRole('button', { name: /Dark Mode/i }))
    expect(container.querySelector('main.visit-main')).toHaveClass('visitor-light')
  })

  it('Dark Mode 저장 후 위저드·조회도 visitor-dark를 쓴다', async () => {
    window.localStorage.setItem('terea-dark-mode', '1')
    document.documentElement.dataset.theme = 'dark'
    const { container, unmount } = renderWithRouter(<App />, ['/apply/privacy'])
    expect(container.querySelector('main.wizard-page')).toHaveClass('visitor-dark')
    unmount()
    const again = renderWithRouter(<App />, ['/lookup'])
    expect(again.container.querySelector('main.lookup-page')).toHaveClass('visitor-dark')
  })
})
