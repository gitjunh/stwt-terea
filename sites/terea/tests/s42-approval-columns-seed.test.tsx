import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { listApplications, listVehicleApplications } from '../src/store/applications'
import { renderWithRouter } from './test-utils'

async function loginAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
}

describe('S42: 방문·차량 승인 컬럼·시드', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('원본 컬럼과 데모 데이터가 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    const table = screen.getByRole('table')
    for (const h of ['방문업체', '직급', '방문자', '방문유형', '방문목적', '장소', '방문기간', '찾아갈 분', '진행상태']) {
      expect(within(table).getByRole('columnheader', { name: h })).toBeInTheDocument()
    }
    expect(listApplications().length).toBeGreaterThanOrEqual(10)

    await user.click(screen.getByRole('link', { name: '차량 승인' }))
    expect(screen.getByRole('columnheader', { name: '차량번호' })).toBeInTheDocument()
    expect(listVehicleApplications().length).toBeGreaterThanOrEqual(5)
  })
})
