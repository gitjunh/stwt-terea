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

describe('S41: 관리 그리드 공통 툴바', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('방문 승인에 엑셀출력·새로고침·컬럼 초기화가 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    expect(screen.getByRole('button', { name: '엑셀출력' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '컬럼 초기화' })).toBeInTheDocument()
  })
})
