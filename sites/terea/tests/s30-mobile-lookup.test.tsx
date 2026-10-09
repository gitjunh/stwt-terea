import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LOCAL_VISITOR_SEED } from '../src/auth/visitorAccounts'
import App from '../src/App'
import { stubMobileViewport } from './mobile-test-utils'
import { renderWithRouter } from './test-utils'

describe('S30: 모바일 신청 조회', () => {
  beforeEach(() => {
    window.localStorage.clear()
    stubMobileViewport(375)
  })

  it('모바일 뷰포트에서 신청 조회가 가능하다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/'])
    expect(document.documentElement.dataset.viewport).toBe('mobile')

    await user.click(screen.getByRole('link', { name: '신청 조회' }))
    expect(screen.getByRole('heading', { name: /신청 조회/ })).toBeInTheDocument()
    await user.type(screen.getByLabelText(/성명/), LOCAL_VISITOR_SEED.name)
    await user.type(screen.getByLabelText(/휴대전화/), LOCAL_VISITOR_SEED.phone)
    await user.click(screen.getByRole('button', { name: '조회' }))
    expect(screen.getByText(LOCAL_VISITOR_SEED.name)).toBeInTheDocument()
    expect(screen.getByText(/대기|승인|반려/)).toBeInTheDocument()
    expect(screen.getByText(/모바일 신청 조회 결과/)).toBeInTheDocument()
  })
})
