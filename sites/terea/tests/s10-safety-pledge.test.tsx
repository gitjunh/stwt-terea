import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S10: 안전서약서 화면', () => {
  it('안전서약서 동의 UI와 조항이 보인다', () => {
    renderWithRouter(<App />, ['/apply/safety'])
    expect(screen.getByRole('heading', { name: '안전서약서 동의' })).toBeInTheDocument()
    expect(screen.getByText(/terea\(주\) 전 임직원은/)).toBeInTheDocument()
    expect(screen.getByText(/안전모, 안전화/)).toBeInTheDocument()
    expect(screen.getByText(/20km/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '동의합니다' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '동의하지 않습니다' })).toBeInTheDocument()
  })
})
