import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { stubMobileViewport } from './mobile-test-utils'
import { renderWithRouter } from './test-utils'

async function loginAdmin(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
}

describe('R19: 모바일 UI 잘림 방지', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    stubMobileViewport(390)
  })

  it('CSS에 admin-main overflow 격리·표 wrap 스크롤·탭 스크롤이 있다', () => {
    const css = readFileSync(resolve(__dirname, '../src/index.css'), 'utf8')
    expect(css).toMatch(/\.admin-main\s*\{[^}]*overflow:\s*hidden/s)
    expect(css).toMatch(/\.visitor-table-wrap\s*\{[^}]*overflow-x:\s*auto/s)
    expect(css).toMatch(/\.admin-tabs\s*\{[^}]*overflow-x:\s*auto/s)
    expect(css).toMatch(/\.admin-shell\s*\{[^}]*overflow-x:\s*hidden/s)
  })

  it('권한그룹 관리에서 표 wrap이 있고 셸이 뷰포트 밖으로 안 늘어난다', async () => {
    const user = userEvent.setup()
    await loginAdmin(user)
    await user.click(screen.getByRole('link', { name: '권한그룹 관리' }))
    expect(screen.getByRole('heading', { name: /권한그룹 관리/ })).toBeInTheDocument()
    const wraps = document.querySelectorAll('.visitor-table-wrap')
    const shell = document.querySelector('.admin-shell') as HTMLElement
    expect(wraps.length).toBeGreaterThan(0)
    expect(shell).toHaveClass('is-mobile')
    expect(shell.getBoundingClientRect().width).toBeLessThanOrEqual(390 + 1)
  })
})
