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

describe('S20: 방문신청 링크 보내기', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('링크 보내기로 전화번호를 넣고 전송하면 로컬 기록·성공 표시가 된다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('button', { name: '방문신청 링크 보내기' }))
    const phone = screen.getByLabelText(/수신 전화번호|전화번호/)
    await user.type(phone, '01055556666')
    await user.click(screen.getByRole('button', { name: '전송' }))
    expect(screen.getByText(/전송 성공|보냈습니다|발송 완료/)).toBeInTheDocument()
    const records = JSON.parse(window.localStorage.getItem('terea-link-sends') ?? '[]') as Array<{
      phone: string
    }>
    expect(records.some((r) => r.phone.replace(/\D/g, '') === '01055556666')).toBe(true)
  })
})
