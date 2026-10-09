import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { stubMobileViewport } from './mobile-test-utils'
import { renderWithRouter } from './test-utils'

describe('S29: 모바일 방문신청 완료', () => {
  beforeEach(() => {
    window.localStorage.clear()
    stubMobileViewport(375)
  })

  it('모바일 뷰포트에서 개인정보 동의→서약→정보 입력→제출까지 끝낸다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/'])
    expect(document.documentElement.dataset.viewport).toBe('mobile')

    await user.click(screen.getByRole('link', { name: '방문신청' }))
    await user.click(screen.getByLabelText(/개인정보 수집 및 이용/))
    await user.click(screen.getByLabelText(/방문기록 관리 및 출입 확인/))
    await user.click(screen.getByLabelText(/개인정보 보관 안내 확인/))
    await user.click(screen.getByRole('button', { name: '동의하고 다음' }))

    await user.click(screen.getByLabelText(/내용 확인 후 동의/))
    await user.click(screen.getByRole('button', { name: /동의 후 진행|다음/ }))

    await user.type(screen.getByLabelText(/방문업체|소속/), '모바일업체')
    await user.type(screen.getByLabelText(/방문자 성명|성명/), '모바일방문자')
    await user.type(screen.getByLabelText(/휴대전화/), '01033334444')
    await user.type(screen.getByLabelText(/방문일|방문 시간|방문일\/시간/), '2026-10-25T11:00')
    await user.selectOptions(screen.getByLabelText(/방문유형/), '일반')
    await user.type(screen.getByLabelText(/방문목적|장소/), '모바일 미팅')
    await user.type(screen.getByLabelText(/찾아갈 분/), '모바일담당')
    await user.click(screen.getByRole('button', { name: /신청 완료|제출/ }))

    expect(screen.getByRole('heading', { name: /신청 완료|제출 완료|완료/ })).toBeInTheDocument()
    expect(document.documentElement.dataset.viewport).toBe('mobile')
    expect(screen.getByText(/모바일에서 신청이 완료/)).toBeInTheDocument()
  })
})
