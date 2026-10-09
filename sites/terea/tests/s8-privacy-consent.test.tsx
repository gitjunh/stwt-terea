import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S8: 개인정보 동의 화면', () => {
  it('방문신청 시작 시 개인정보 동의 표·라디오가 보인다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)
    await user.click(screen.getByRole('link', { name: '방문신청' }))
    expect(screen.getAllByRole('heading', { name: /개인정보 수집 및 이용 동의/ }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('수집항목')).toBeInTheDocument()
    expect(screen.getByText('소속, 성명')).toBeInTheDocument()
    expect(screen.getByText('휴대전화번호')).toBeInTheDocument()
    expect(screen.getByText('얼굴사진')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /모두 동의합니다/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '동의합니다' })).toBeInTheDocument()
  })
})
