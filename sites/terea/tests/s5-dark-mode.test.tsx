import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

afterEach(() => {
  document.documentElement.dataset.theme = 'light'
  window.localStorage.removeItem('terea-dark-mode')
})

describe('S5: Dark Mode 전환', () => {
  it('방문 메인에서 Dark Mode를 켜고 끌 수 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)
    const toggle = screen.getByRole('button', { name: /Dark Mode/i })
    expect(document.documentElement.dataset.theme).not.toBe('dark')
    await user.click(toggle)
    expect(document.documentElement.dataset.theme).toBe('dark')
    await user.click(toggle)
    expect(document.documentElement.dataset.theme).not.toBe('dark')
  })
})
