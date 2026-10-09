import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { stubMobileViewport } from './mobile-test-utils'
import { renderWithRouter } from './test-utils'

describe('S28: 모바일 방문 메인', () => {
  beforeEach(() => {
    stubMobileViewport(375)
  })

  it('좁은 뷰포트에서 방문신청·신청 조회 진입을 쓸 수 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/'])
    expect(document.documentElement.dataset.viewport).toBe('mobile')
    expect(screen.getByRole('link', { name: '방문신청' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '신청 조회' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: '방문신청' }))
    expect(screen.getAllByRole('heading', { name: /개인정보/ }).length).toBeGreaterThan(0)
  })
})
