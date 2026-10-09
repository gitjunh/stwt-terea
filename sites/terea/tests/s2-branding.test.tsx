import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S2: terea 표기', () => {
  it('초기 화면에 terea가 보이고 kemco/KEMCO/켐코가 없다', () => {
    const { container } = renderWithRouter(<App />)
    expect(screen.getByText(/terea/i)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/kemco/i)
    expect(container.textContent).not.toMatch(/켐코/)
  })
})
