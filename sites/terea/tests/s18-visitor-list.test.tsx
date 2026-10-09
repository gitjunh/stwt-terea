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

describe('S18: 방문자 현황 목록', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('방문자 현황에 목록과 주요 컬럼이 보인다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    expect(screen.getByRole('heading', { name: /방문자 현황/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /방문업체/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /방문자/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /휴대전화/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /방문유형/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /진행상태/ })).toBeInTheDocument()
    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('김대기')).toBeInTheDocument()
  })
})
