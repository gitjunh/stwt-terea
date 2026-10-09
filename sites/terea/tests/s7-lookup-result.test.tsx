import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S7: 신청 조회 결과', () => {
  it('식별 정보로 신청 상태를 조회할 수 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    await user.type(screen.getByLabelText('성명'), '홍길동')
    await user.type(screen.getByLabelText('휴대전화'), '01012345678')
    await user.click(screen.getByRole('button', { name: '조회' }))
    const row = screen.getByText('홍길동').closest('li')
    expect(row).toBeTruthy()
    expect(row!).toHaveTextContent(/승인|대기|반려/)
  })
})
