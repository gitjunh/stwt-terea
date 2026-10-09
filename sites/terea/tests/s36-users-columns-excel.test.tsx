import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function openUsers(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
  await user.click(screen.getByRole('link', { name: '사용자 관리' }))
}

describe('S36: 사용자 리스트 컬럼·엑셀', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('원본 컬럼과 엑셀출력이 있다', async () => {
    const user = userEvent.setup()
    await openUsers(user)

    expect(screen.getByRole('heading', { name: /사용자 리스트/ })).toBeInTheDocument()
    const table = screen.getByRole('table')
    for (const label of [
      '사용자ID',
      '사용자명',
      '사용자명(영문)',
      '부서',
      '유선번호',
      '핸드폰',
      '이메일',
      '소재지',
      '사용권한',
      '사용여부',
    ]) {
      expect(within(table).getByRole('columnheader', { name: label })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: '신규' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '비밀번호초기화' }).length).toBeGreaterThan(0)

    const createObjectURL = vi.fn(() => 'blob:terea-users')
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, writable: true, value: vi.fn() })
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await user.click(screen.getByRole('button', { name: /엑셀출력/ }))
    expect(createObjectURL).toHaveBeenCalled()
    const anchor = clickSpy.mock.instances[0] as HTMLAnchorElement
    expect(anchor.download).toMatch(/terea-users/i)
    clickSpy.mockRestore()
  })
})
