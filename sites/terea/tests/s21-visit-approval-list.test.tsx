import { screen } from '@testing-library/react'
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

describe('S21: 방문 승인 목록', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('방문 승인 메뉴에서 신청 건을 볼 수 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    expect(screen.getByRole('heading', { name: /방문 승인/ })).toBeInTheDocument()
    expect(screen.getByText('김대기')).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
  })
})
