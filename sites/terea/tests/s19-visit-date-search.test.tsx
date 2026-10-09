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

describe('S19: 방문일 검색', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('방문일 기간 조건으로 검색할 수 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('김대기')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/시작일|방문일 시작|from/i), '2026-10-11')
    await user.type(screen.getByLabelText(/종료일|방문일 종료|to/i), '2026-10-13')
    await user.click(screen.getByRole('button', { name: /검색/ }))

    const table = screen.getByRole('table')
    expect(within(table).getByText('김대기')).toBeInTheDocument()
    expect(within(table).queryByText('홍길동')).not.toBeInTheDocument()
    expect(within(table).queryByText('이반려')).not.toBeInTheDocument()
  })
})
