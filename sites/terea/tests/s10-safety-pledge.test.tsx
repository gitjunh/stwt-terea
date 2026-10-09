import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S10: 안전서약서 화면', () => {
  it('안전서약서 확인·동의 UI가 보인다', () => {
    renderWithRouter(<App />, ['/apply/safety'])
    expect(screen.getByRole('heading', { name: '안전서약서 확인' })).toBeInTheDocument()
    expect(screen.getByText(/방문 중 지켜야 할 안전·보안 준수사항/)).toBeInTheDocument()
    expect(screen.getByLabelText(/내용 확인 후 동의/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /동의 후 진행|다음/ })).toBeInTheDocument()
  })
})
