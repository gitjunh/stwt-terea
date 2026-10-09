import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S12: 방문정보 필수 필드', () => {
  it('방문업체/소속, 성명, 휴대전화, 방문일/시간, 방문유형, 방문목적/장소, 찾아갈 분이 있다', () => {
    renderWithRouter(<App />, ['/apply/visit-info'])
    expect(screen.getByLabelText(/방문업체|소속/)).toBeInTheDocument()
    expect(screen.getByLabelText(/방문자 성명|성명/)).toBeInTheDocument()
    expect(screen.getByLabelText(/휴대전화/)).toBeInTheDocument()
    expect(screen.getByLabelText(/방문일|방문 시간|방문일\/시간/)).toBeInTheDocument()
    expect(screen.getByLabelText(/방문유형/)).toBeInTheDocument()
    expect(screen.getByLabelText(/방문목적|장소/)).toBeInTheDocument()
    expect(screen.getByLabelText(/찾아갈 분/)).toBeInTheDocument()
  })
})
