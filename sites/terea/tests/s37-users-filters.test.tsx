import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function openUsers(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
  await user.click(screen.getByRole('link', { name: '사용자 관리' }))
}

describe('S37: 사용자 컬럼 필터', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('텍스트 필터와 부서·소재지·사용여부 콤보로 걸러진다', async () => {
    const user = userEvent.setup()
    await openUsers(user)

    expect(screen.getByLabelText('사용자ID 필터')).toBeInTheDocument()
    expect(screen.getByLabelText('사용자명 필터')).toBeInTheDocument()
    expect(screen.getByLabelText('부서 필터').tagName).toBe('SELECT')
    expect(screen.getByLabelText('소재지 필터').tagName).toBe('SELECT')
    expect(screen.getByLabelText('사용여부 필터').tagName).toBe('SELECT')

    await user.selectOptions(screen.getByLabelText('소재지 필터'), 'terea2공장')
    expect(screen.getAllByText('terea2공장').length).toBeGreaterThan(0)

    await user.type(screen.getByLabelText('사용자명 필터'), '김민수')
    expect(screen.getByText('김민수')).toBeInTheDocument()
    expect(screen.queryByText('이서연')).not.toBeInTheDocument()
  })
})
