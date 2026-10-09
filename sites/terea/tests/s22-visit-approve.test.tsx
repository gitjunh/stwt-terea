import { screen, within } from '@testing-library/react'
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

describe('S22: 방문 승인 처리', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('신청 건을 승인하면 진행상태가 승인으로 바뀐다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    const row = screen.getByText('김대기').closest('tr')
    expect(row).toBeTruthy()
    expect(within(row as HTMLElement).getByText('대기')).toBeInTheDocument()
    await user.click(within(row as HTMLElement).getByRole('button', { name: '승인' }))
    expect(within(row as HTMLElement).getByText('승인')).toBeInTheDocument()
  })
})
