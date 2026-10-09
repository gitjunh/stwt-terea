import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function loginAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
}

describe('R28: 방문일 검색조건 한 줄 정렬', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('발급/반납 조회·출입이력 검색조건에 시작·종료 방문일이 있다', async () => {
    const user = userEvent.setup()
    await loginAsAdmin(user)

    await user.click(screen.getByRole('link', { name: '방문카드 발급/반납 조회' }))
    const cardsSearch = screen.getByLabelText('검색조건')
    expect(within(cardsSearch).getByLabelText('방문일 시작')).toBeInTheDocument()
    expect(within(cardsSearch).getByLabelText('방문일 종료')).toBeInTheDocument()
    expect(cardsSearch.querySelector('.date-range-field')).toBeTruthy()

    await user.click(screen.getByRole('link', { name: '방문자 출입이력' }))
    const logsSearch = screen.getByLabelText('검색조건')
    expect(within(logsSearch).getByLabelText('방문일 시작')).toBeInTheDocument()
    expect(within(logsSearch).getByLabelText('방문일 종료')).toBeInTheDocument()
    expect(logsSearch.querySelector('.date-range-field')).toBeTruthy()
  })
})
