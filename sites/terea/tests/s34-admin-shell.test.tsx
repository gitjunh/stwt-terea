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

describe('S34: 관리자 AdminShell · 권한그룹', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('사이드바에서 권한그룹 관리로 이동하고 그룹·권한 표를 본다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    expect(screen.getByText('방문예약 시스템')).toBeInTheDocument()
    expect(screen.getByText('terea')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: '권한그룹 관리' }))
    expect(screen.getByRole('heading', { name: /권한그룹 관리/ })).toBeInTheDocument()
    expect(screen.getByText('1001')).toBeInTheDocument()
    expect(screen.getByText('관리자')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '권한 목록' })).toBeInTheDocument()
  })
})
