import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { writeDraft } from '../src/store/applyDraft'
import { renderWithRouter } from './test-utils'

beforeEach(() => {
  window.sessionStorage.clear()
  writeDraft({
    host: '담당자',
    locations: ['올인원제련소 본관'],
    purpose: '회의참석 및 업무협의(심사 등)',
    visitType: '방문(일반,협의,심사)',
    visitStart: '2026-10-15',
    visitEnd: '2026-10-15',
  })
})

async function fillVisitor(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/방문업체|소속/), 'terea 파트너')
  await user.type(screen.getByLabelText(/방문자 성명|성명/), '테스트방문자')
  await user.type(screen.getByLabelText(/휴대전화/), '01011112222')
}

describe('S15: 방문신청 제출', () => {
  it('신청을 제출하면 완료 안내가 보인다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/visitor-info'])
    await fillVisitor(user)
    await user.click(screen.getByRole('button', { name: /신청 완료|제출/ }))
    expect(screen.getByRole('heading', { name: /신청 완료|제출 완료|완료/ })).toBeInTheDocument()
    expect(screen.getByText(/신청이 접수|완료되었|접수되었/)).toBeInTheDocument()
  })
})
