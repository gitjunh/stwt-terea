import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { localAdmin, USER_LOCATION_FIXED } from '../src/store/adminEntities'
import { renderWithRouter } from './test-utils'

describe('S39: 데모 사용자 20명 시드', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('소재지 terea2공장인 데모 사용자 20명 이상이 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/manager/login'])
    await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
    await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
    await user.click(screen.getByRole('button', { name: /로그인/ }))
    await user.click(screen.getByRole('link', { name: '사용자 관리' }))

    const users = localAdmin.listUsers()
    const demos = users.filter((u) => u.username !== 'admin')
    expect(demos.length).toBeGreaterThanOrEqual(20)
    expect(demos.every((u) => u.location === USER_LOCATION_FIXED)).toBe(true)
    expect(demos.every((u) => /^[가-힣]+$/.test(u.name))).toBe(true)
    expect(demos.some((u) => u.mobile.startsWith('010'))).toBe(true)
    expect(demos.some((u) => u.email.includes('@'))).toBe(true)
    expect(demos.some((u) => u.active) && demos.some((u) => !u.active)).toBe(true)
  })
})
