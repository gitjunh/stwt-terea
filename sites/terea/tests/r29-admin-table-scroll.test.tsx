import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function loginAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
}

describe('R29: 관리자 표 가로 스크롤이 뷰포트에 보임', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('CSS가 admin-content·표 래퍼를 뷰포트 높이로 제한하고 overflow auto를 쓴다', () => {
    const css = readFileSync(resolve(__dirname, '../src/index.css'), 'utf8')
    expect(css).toMatch(/\.admin-content\s*\{[^}]*display:\s*flex/s)
    expect(css).toMatch(/\.admin-content\s*\{[^}]*overflow:\s*hidden/s)
    expect(css).toMatch(
      /\.admin-content > \.visitor-table-wrap\s*\{[^}]*overflow:\s*auto/s,
    )
    expect(css).toMatch(
      /\.admin-content > \.visitor-table-wrap\s*\{[^}]*min-height:\s*0/s,
    )
    expect(css).toMatch(/\.visitor-table-wrap\s*\{[^}]*overflow:\s*auto/s)
  })

  it('사용자 관리에 표 래퍼가 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: /사용자/ }))
    expect(document.querySelector('.admin-content > .visitor-table-wrap')).toBeTruthy()
  })
})
