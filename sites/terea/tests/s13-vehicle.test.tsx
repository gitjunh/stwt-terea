import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S13: 차량번호 입력', () => {
  it('방문자 정보에서 차량번호를 입력할 수 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/visitor-info'])
    const vehicle = screen.getByLabelText(/차량번호/)
    expect(vehicle).toBeInTheDocument()
    await user.type(vehicle, '12가3456')
    expect(vehicle).toHaveValue('12가3456')
  })
})
