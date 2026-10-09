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

describe('S24: 차량 승인 처리', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('차량 승인 메뉴에서 차량 출입 승인을 처리할 수 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '차량 승인' }))
    expect(screen.getByRole('heading', { name: /차량 승인/ })).toBeInTheDocument()
    expect(screen.getByText('12가3456')).toBeInTheDocument()
    const row = screen.getByText('12가3456').closest('tr')
    expect(row).toBeTruthy()
    await user.click(within(row as HTMLElement).getByRole('button', { name: '차량 승인' }))
    expect(within(row as HTMLElement).getByText(/차량승인|승인됨|승인완료/)).toBeInTheDocument()
  })
})
