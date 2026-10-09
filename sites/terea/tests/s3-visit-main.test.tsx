import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S3: 방문 메인 환영·진입', () => {
  it('방문을 환영합니다, 방문신청, 신청 조회가 보인다', () => {
    renderWithRouter(<App />)
    expect(screen.getByText(/방문을 환영합니다/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '방문신청' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '신청 조회' })).toBeInTheDocument()
  })
})
