import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S31: 원본 UI 동일화 (R13)', () => {
  it('메인에 방문신청·신청 조회 카드 CTA가 있다', () => {
    renderWithRouter(<App />)
    const nav = screen.getByRole('navigation', { name: '주요 진입' })
    expect(within(nav).getByRole('link', { name: /방문신청/ })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /신청 조회/ })).toBeInTheDocument()
    expect(document.querySelector('.main-card')).toBeTruthy()
  })

  it('위저드 스테퍼가 4단이다', () => {
    renderWithRouter(<App />, ['/apply/privacy'])
    const stepper = screen.getByRole('list', { name: '신청 단계' })
    expect(within(stepper).getByText('개인정보동의')).toBeInTheDocument()
    expect(within(stepper).getByText('안전서약서')).toBeInTheDocument()
    expect(within(stepper).getByText('방문 정보')).toBeInTheDocument()
    expect(within(stepper).getByText('방문자 정보')).toBeInTheDocument()
    expect(within(stepper).getAllByRole('listitem')).toHaveLength(4)
  })

  it('개인정보동의 표 문구가 있다', () => {
    renderWithRouter(<App />, ['/apply/privacy'])
    expect(screen.getByText('수집항목')).toBeInTheDocument()
    expect(screen.getByText('이용목적')).toBeInTheDocument()
    expect(screen.getByText('보유기간')).toBeInTheDocument()
    expect(screen.getByText('방문자 확인, 이력 관리')).toBeInTheDocument()
    expect(screen.getByText('방문 종료시까지')).toBeInTheDocument()
    expect(screen.getByText(/원칙적으로 외부/)).toBeInTheDocument()
  })

  it('방문 정보 장소는 다중 선택된다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/visit-info'])
    expect(screen.getByLabelText('올인원제련소 경비실')).toBeInTheDocument()
    expect(screen.getByLabelText('올인원제련소 본관')).toBeInTheDocument()
    expect(screen.getByLabelText('1공장 제어실(C/R)')).toBeInTheDocument()
    expect(screen.getByLabelText('1공장 기타구역')).toBeInTheDocument()
    await user.click(screen.getByLabelText('올인원제련소 경비실'))
    await user.click(screen.getByLabelText('올인원제련소 본관'))
    await user.click(screen.getByLabelText('올인원제련소 파워룸'))
    expect(screen.getByLabelText('올인원제련소 경비실')).toBeChecked()
    expect(screen.getByLabelText('올인원제련소 본관')).toBeChecked()
    expect(screen.getByLabelText('올인원제련소 파워룸')).toBeChecked()
    expect(screen.getByLabelText('올인원제련소 공정설비')).not.toBeChecked()
  })
})
