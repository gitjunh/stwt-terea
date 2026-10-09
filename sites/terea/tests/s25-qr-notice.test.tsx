import { cleanup, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function loginAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
}

describe('S25: 승인 후 QR 안내', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('방문 승인 후 방문측에 QR 안내가 로컬에서 확인 가능하다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    const row = screen.getByText('김대기').closest('tr')
    expect(row).toBeTruthy()
    await user.click(within(row as HTMLElement).getByRole('button', { name: '승인' }))
    const adminQr = screen.getByRole('region', { name: /QR 안내|승인 QR/ })
    expect(within(adminQr).getByText(/QR 코드:/)).toBeInTheDocument()

    cleanup()
    const visitor = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    await visitor.type(screen.getByLabelText(/성명/), '김대기')
    await visitor.type(screen.getByLabelText(/휴대전화/), '01099998888')
    await visitor.click(screen.getByRole('button', { name: '조회' }))
    const visitorQr = screen.getByRole('region', { name: /QR 안내|승인 QR/ })
    expect(within(visitorQr).getByText(/QR 코드:/)).toBeInTheDocument()
  })
})
