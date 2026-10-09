import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S4: 방문 메인 출입절차', () => {
  it('STEP 1–4 라벨이 메인에 표시된다', () => {
    renderWithRouter(<App />)
    expect(screen.getByText('방문신청', { selector: '.step-label' })).toBeInTheDocument()
    expect(screen.getByText('출입승인')).toBeInTheDocument()
    expect(screen.getByText('QRCode인식')).toBeInTheDocument()
    expect(screen.getByText('방문증발급')).toBeInTheDocument()
  })
})
