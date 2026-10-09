import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S16: 관리 로그인 화면', () => {
  it('관리 로그인에서 ID·PW를 입력할 수 있다', () => {
    renderWithRouter(<App />, ['/manager/login'])
    expect(screen.getByRole('heading', { name: /관리|로그인/ })).toBeInTheDocument()
    expect(screen.getByLabelText(/ID|아이디|사번/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/PW|비밀번호|암호/i)).toBeInTheDocument()
  })
})
