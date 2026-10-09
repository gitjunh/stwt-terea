import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { stubMobileViewport } from './mobile-test-utils'
import { renderWithRouter } from './test-utils'

describe('S29: 모바일 방문신청 완료', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    stubMobileViewport(375)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('모바일 뷰포트에서 개인정보 동의→서약→정보 입력→제출까지 끝낸다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/'])
    expect(document.documentElement.dataset.viewport).toBe('mobile')

    await user.click(screen.getByRole('link', { name: '방문신청' }))
    await user.click(screen.getByRole('button', { name: /모두 동의합니다/ }))
    await user.click(screen.getByRole('button', { name: '동의합니다' }))

    const safetyAgree = screen.getAllByRole('radio', { name: '동의합니다.' })[0]
    await user.click(safetyAgree)
    await user.click(screen.getByRole('button', { name: '동의합니다' }))

    await user.type(screen.getByLabelText(/찾아가시는 분|찾아갈 분/), '모바일담당')
    await user.click(screen.getByLabelText('올인원제련소 본관'))
    await user.click(screen.getByLabelText(/회의참석 및 업무협의/))
    await user.click(screen.getByRole('button', { name: /다음.*방문자 정보/ }))

    await user.type(screen.getByLabelText(/방문업체|소속/), '모바일업체')
    await user.type(screen.getByLabelText(/방문자 성명|성명/), '모바일방문자')
    await user.type(screen.getByLabelText(/휴대전화/), '01033334444')
    await user.click(screen.getByRole('button', { name: /신청 완료|제출/ }))

    expect(screen.getByRole('heading', { name: /신청 완료|제출 완료|완료/ })).toBeInTheDocument()
    expect(document.documentElement.dataset.viewport).toBe('mobile')
    expect(screen.getByText(/모바일에서 신청이 완료/)).toBeInTheDocument()
  })
})
