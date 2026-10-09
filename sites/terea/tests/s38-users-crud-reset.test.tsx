import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { USER_PASSWORD_RESET } from '../src/store/adminEntities'
import { renderWithRouter } from './test-utils'

async function openUsers(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
  await user.click(screen.getByRole('link', { name: '사용자 관리' }))
}

describe('S38: 사용자 수정·삭제·비밀번호 초기화', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('수정·삭제·비밀번호 초기화가 동작한다', async () => {
    const user = userEvent.setup()
    await openUsers(user)

    const row = screen.getByText('김민수').closest('tr')
    expect(row).toBeTruthy()
    await user.click(within(row as HTMLElement).getByRole('button', { name: '수정' }))
    const form = screen.getByRole('form', { name: '사용자 편집' })
    const nameInput = within(form).getByLabelText('사용자명')
    await user.clear(nameInput)
    await user.type(nameInput, '김민수정')
    await user.click(within(form).getByRole('button', { name: /수정 저장/ }))
    expect(screen.getByText('김민수정')).toBeInTheDocument()

    await user.click(within(screen.getByText('김민수정').closest('tr') as HTMLElement).getByRole('button', { name: '비밀번호초기화' }))
    expect(screen.getByText(new RegExp(USER_PASSWORD_RESET))).toBeInTheDocument()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(within(screen.getByText('김민수정').closest('tr') as HTMLElement).getByRole('button', { name: '삭제' }))
    expect(screen.queryByText('김민수정')).not.toBeInTheDocument()
  })
})
