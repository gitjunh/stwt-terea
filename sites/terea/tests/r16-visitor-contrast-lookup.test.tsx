import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { LOCAL_VISITOR_SEED } from '../src/auth/visitorAccounts'
import { renderWithRouter } from './test-utils'

describe('R16: 방문 신청 조회 텍스트 대비', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('CSS가 light/dark 조회 결과 행에 각각 대비 색을 둔다', () => {
    const css = readFileSync(resolve(__dirname, '../src/index.css'), 'utf8')
    expect(css).toMatch(/\.lookup-results li\s*\{[^}]*color:\s*#1a1a1a/s)
    expect(css).toMatch(/\.lookup-page\.visitor-light \.lookup-form input[^}]*background:\s*#fff/s)
    expect(css).toMatch(/\.lookup-page\.visitor-dark \.lookup-results li\s*\{[^}]*color:\s*#e2e8f0/s)
  })

  it('라이트 테마 조회 결과 성명·상태가 렌더된다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    expect(document.querySelector('main.lookup-page')).toHaveClass('visitor-light')
    await user.type(screen.getByLabelText(/성명/), LOCAL_VISITOR_SEED.name)
    await user.type(screen.getByLabelText(/휴대전화/), LOCAL_VISITOR_SEED.phone)
    await user.click(screen.getByRole('button', { name: /조회/ }))
    const list = screen.getByRole('list')
    expect(within(list).getByText(LOCAL_VISITOR_SEED.name)).toBeInTheDocument()
    expect(within(list).getByText('대기')).toBeInTheDocument()
  })

  it('다크 테마에서도 조회 결과 성명·상태가 렌더된다', async () => {
    window.localStorage.setItem('terea-dark-mode', '1')
    document.documentElement.dataset.theme = 'dark'
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    expect(document.querySelector('main.lookup-page')).toHaveClass('visitor-dark')
    await user.type(screen.getByLabelText(/성명/), LOCAL_VISITOR_SEED.name)
    await user.type(screen.getByLabelText(/휴대전화/), LOCAL_VISITOR_SEED.phone)
    await user.click(screen.getByRole('button', { name: /조회/ }))
    expect(within(screen.getByRole('list')).getByText('대기')).toBeInTheDocument()
  })
})
