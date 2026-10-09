import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

afterEach(() => {
  document.documentElement.dataset.theme = 'light'
  window.localStorage.removeItem('terea-dark-mode')
})

describe('R27: 다크·라이트 테마 글자 대비 전수', () => {
  it('동의·서약·라디오 기본 글자색이 라이트에서 읽힌다', () => {
    const css = readFileSync(resolve(__dirname, '../src/index.css'), 'utf8')
    expect(css).toMatch(/\.consent-radios label\s*\{[^}]*color:\s*#1a1a1a/s)
    expect(css).toMatch(/\.consent-bullets\s*\{[^}]*color:\s*#1a1a1a/s)
    expect(css).toMatch(/\.pledge-clauses\s*\{[^}]*color:\s*#1a1a1a/s)
    expect(css).toMatch(/\.consent-table th\s*\{[^}]*background:\s*#e8eef6/s)
    expect(css).toMatch(/\.consent-table th\s*\{[^}]*color:\s*#0f172a/s)
    expect(css).toMatch(
      /\.wizard-page\.visitor-dark \.consent-radios label[\s\S]*?color:\s*#e2e8f0/,
    )
    expect(css).toMatch(/\.admin-login \.context\s*\{[^}]*color:\s*#475569/s)
  })

  it('라이트 동의 페이지에 visitor-light가 적용된다', async () => {
    const { container } = renderWithRouter(<App />, ['/apply/privacy'])
    expect(container.querySelector('main.wizard-page')).toHaveClass('visitor-light')
    expect(screen.getAllByRole('heading', { name: /개인정보/i }).length).toBeGreaterThan(0)
  })

  it('다크 모드 켜도 관리 로그인 context는 읽힌다', async () => {
    window.localStorage.setItem('terea-dark-mode', '1')
    document.documentElement.dataset.theme = 'dark'
    renderWithRouter(<App />, ['/manager/login'])
    expect(screen.getByText('방문예약·관리')).toBeInTheDocument()
    expect(screen.getByLabelText('Remember')).toBeInTheDocument()
  })

  it('다크 방문 메인에서 Dark Mode 토글이 visitor-dark를 유지한다', async () => {
    const user = userEvent.setup()
    const { container } = renderWithRouter(<App />)
    await user.click(screen.getByRole('button', { name: /Dark Mode/i }))
    expect(container.querySelector('main.visit-main')).toHaveClass('visitor-dark')
  })
})
