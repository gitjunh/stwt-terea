import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/방문업체|소속/), 'terea 파트너')
  await user.type(screen.getByLabelText(/방문자 성명|성명/), '테스트방문자')
  await user.type(screen.getByLabelText(/휴대전화/), '01011112222')
  await user.type(screen.getByLabelText(/방문일|방문 시간|방문일\/시간/), '2026-10-15T10:00')
  await user.selectOptions(screen.getByLabelText(/방문유형/), '일반')
  await user.type(screen.getByLabelText(/방문목적|장소/), '미팅 / 본관')
  await user.type(screen.getByLabelText(/찾아갈 분/), '담당자')
}

describe('S15: 방문신청 제출', () => {
  it('신청을 제출하면 완료 안내가 보인다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/visit-info'])
    await fillRequired(user)
    await user.click(screen.getByRole('button', { name: /신청 완료|제출/ }))
    expect(screen.getByRole('heading', { name: /신청 완료|제출 완료|완료/ })).toBeInTheDocument()
    expect(screen.getByText(/신청이 접수|완료되었|접수되었/)).toBeInTheDocument()
  })
})
