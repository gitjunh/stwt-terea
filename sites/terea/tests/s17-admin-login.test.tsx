import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

/** 로컬 관리 시드와 동일(원본 운영 계정 아님). sites/terea/src/auth/adminAccounts.ts */
const LOCAL_ADMIN_ID = 'terea-admin'
const LOCAL_ADMIN_PW = 'terea-admin-local-01'

describe('S17: 로컬 관리 테스트 계정 로그인', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('로컬 관리 테스트 계정으로 로그인에 성공한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/manager/login'])
    await user.type(screen.getByLabelText(/ID|아이디|사번/i), LOCAL_ADMIN_ID)
    await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), LOCAL_ADMIN_PW)
    await user.click(screen.getByRole('button', { name: /로그인/ }))
    expect(screen.getByRole('heading', { name: /방문자 현황/ })).toBeInTheDocument()
    expect(screen.queryByLabelText(/PW|비밀번호|암호/i)).not.toBeInTheDocument()
  })
})
