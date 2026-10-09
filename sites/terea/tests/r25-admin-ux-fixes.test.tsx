import { screen, within } from '@testing-library/react'
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

describe('R25: 관리자 UX 수정', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('탭 닫기·로그아웃·Remember가 동작한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/manager/login'])
    expect(screen.getByLabelText('Remember')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
    await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
    await user.click(screen.getByLabelText('Remember'))
    await user.click(screen.getByRole('button', { name: /로그인/ }))

    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    expect(screen.getByRole('tab', { name: /방문 승인/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '방문 승인 닫기' }))
    expect(screen.queryByRole('button', { name: '방문 승인 닫기' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '로그아웃' }))
    expect(screen.getByRole('heading', { name: '관리 로그인' })).toBeInTheDocument()
    expect(screen.getByLabelText(/ID|아이디|사번/i)).toHaveValue('terea-admin')
  })

  it('방문자 현황 검색조건 레이아웃 요소가 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    const search = screen.getByLabelText('검색조건')
    expect(within(search).getByLabelText('방문일 시작')).toBeInTheDocument()
    expect(within(search).getByLabelText('방문일 종료')).toBeInTheDocument()
    expect(within(search).getByRole('button', { name: '검색' })).toBeInTheDocument()
  })
})
