import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S8: 개인정보 동의 화면', () => {
  it('방문신청 시작 시 개인정보 동의 화면과 필수 항목이 보인다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)
    await user.click(screen.getByRole('link', { name: '방문신청' }))
    expect(screen.getByRole('heading', { name: /개인정보 수집·이용 동의/ })).toBeInTheDocument()
    expect(screen.getByLabelText(/개인정보 수집 및 이용/)).toBeInTheDocument()
    expect(screen.getByLabelText(/방문기록 관리 및 출입 확인/)).toBeInTheDocument()
    expect(screen.getByLabelText(/개인정보 보관 안내 확인/)).toBeInTheDocument()
  })
})
