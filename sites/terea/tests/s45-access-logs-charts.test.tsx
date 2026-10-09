import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { localAdmin } from '../src/store/adminEntities'
import { renderWithRouter } from './test-utils'

describe('S45: 출입이력·그래프', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('검색·원본 컬럼·기간별/일별 그래프가 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/manager/login'])
    await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
    await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
    await user.click(screen.getByRole('button', { name: /로그인/ }))
    await user.click(screen.getByRole('link', { name: '방문자 출입이력' }))

    expect(screen.getByLabelText('검색조건')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '인증일시' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '카드이름' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '기간별 총 출입현황' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '일별 출입현황' })).toBeInTheDocument()
    expect(localAdmin.listAccessLogs().length).toBeGreaterThanOrEqual(20)
  })
})
