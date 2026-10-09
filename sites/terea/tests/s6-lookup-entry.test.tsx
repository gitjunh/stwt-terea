import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S6: 신청 조회 화면', () => {
  it('신청 조회로 조회 화면에 들어간다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)
    await user.click(screen.getByRole('link', { name: '신청 조회' }))
    expect(screen.getByRole('heading', { name: '신청 조회' })).toBeInTheDocument()
  })
})
