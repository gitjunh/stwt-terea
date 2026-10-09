import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S12: 방문정보 필수 필드', () => {
  it('찾아가시는 분, 방문 장소·목적·유형·기간이 있다', () => {
    renderWithRouter(<App />, ['/apply/visit-info'])
    expect(screen.getByLabelText(/찾아가시는 분|찾아갈 분/)).toBeInTheDocument()
    expect(screen.getByText('방문 장소')).toBeInTheDocument()
    expect(screen.getByLabelText('올인원제련소 본관')).toBeInTheDocument()
    expect(screen.getByLabelText('1공장 경비실')).toBeInTheDocument()
    expect(screen.getByText('방문 목적')).toBeInTheDocument()
    expect(screen.getByText('방문 유형')).toBeInTheDocument()
    expect(screen.getByLabelText(/방문 시작/)).toBeInTheDocument()
    expect(screen.getByLabelText(/방문 종료/)).toBeInTheDocument()
    expect(screen.getByText(/최대 30일까지 가능/)).toBeInTheDocument()
  })
})
