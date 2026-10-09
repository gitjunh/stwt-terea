import { cleanup, screen, within } from '@testing-library/react'
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

describe('R26: 신청 조회 승인 시 QR·경비실 안내', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('대기 상태 조회 시 QR·경비실 안내가 없다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    await user.type(screen.getByLabelText(/성명/), '김대기')
    await user.type(screen.getByLabelText(/휴대전화/), '01099998888')
    await user.click(screen.getByRole('button', { name: '조회' }))
    expect(screen.getByText('대기')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /QR 안내/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/경비실/)).not.toBeInTheDocument()
  })

  it('승인 상태 조회 시 QR과 경비실 방문 안내가 보인다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    await user.type(screen.getByLabelText(/성명/), '홍길동')
    await user.type(screen.getByLabelText(/휴대전화/), '01012345678')
    await user.click(screen.getByRole('button', { name: '조회' }))
    expect(screen.getByText('승인')).toBeInTheDocument()
    const panel = screen.getByRole('region', { name: /QR 안내/ })
    expect(within(panel).getByText(/경비실로 방문/)).toBeInTheDocument()
    expect(within(panel).getByLabelText(/방문 승인 QR 코드/)).toBeInTheDocument()
    expect(within(panel).getByText(/QR 코드:/)).toBeInTheDocument()
  })

  it('관리자 승인 후 같은 신청자가 조회하면 QR·경비실 안내가 보인다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)
    await user.click(screen.getByRole('link', { name: '방문 승인' }))
    const row = screen.getByText('김대기').closest('tr')
    expect(row).toBeTruthy()
    await user.click(within(row as HTMLElement).getByRole('button', { name: '승인' }))
    expect(screen.getByText(/경비실로 방문/)).toBeInTheDocument()

    cleanup()
    const visitor = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    await visitor.type(screen.getByLabelText(/성명/), '김대기')
    await visitor.type(screen.getByLabelText(/휴대전화/), '01099998888')
    await visitor.click(screen.getByRole('button', { name: '조회' }))
    const panel = screen.getByRole('region', { name: /QR 안내/ })
    expect(within(panel).getByText(/경비실로 방문/)).toBeInTheDocument()
    expect(within(panel).getByLabelText(/방문 승인 QR 코드/)).toBeInTheDocument()
  })
})
