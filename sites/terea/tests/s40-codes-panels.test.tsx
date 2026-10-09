import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

async function openCodes(user: ReturnType<typeof userEvent.setup>) {
  renderWithRouter(<App />, ['/manager/login'])
  await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
  await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
  await user.click(screen.getByRole('button', { name: /로그인/ }))
  await user.click(screen.getByRole('link', { name: '기초코드 관리' }))
}

describe('S40: 기초코드 2×2 카드', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('네 패널·원본 컬럼·방문지역 필터가 있다', async () => {
    const user = userEvent.setup()
    await openCodes(user)

    const location = screen.getByRole('region', { name: '방문 장소' })
    const purpose = screen.getByRole('region', { name: '방문 목적' })
    const card = screen.getByRole('region', { name: '방문 카드' })
    const device = screen.getByRole('region', { name: '전자 기기' })

    expect(within(location).getByRole('heading', { name: '방문 장소' })).toBeInTheDocument()
    expect(within(purpose).getByRole('heading', { name: '방문 목적' })).toBeInTheDocument()
    expect(within(card).getByRole('heading', { name: '방문 카드' })).toBeInTheDocument()
    expect(within(device).getByRole('heading', { name: '전자 기기' })).toBeInTheDocument()

    expect(within(location).getByRole('columnheader', { name: '장소코드' })).toBeInTheDocument()
    expect(within(location).getByRole('columnheader', { name: '장소명(영문)' })).toBeInTheDocument()
    expect(within(purpose).getByRole('columnheader', { name: '항목코드' })).toBeInTheDocument()
    expect(within(card).getByRole('columnheader', { name: '카드번호' })).toBeInTheDocument()
    expect(within(card).getByRole('columnheader', { name: '방문유형' })).toBeInTheDocument()
    expect(within(device).getByRole('columnheader', { name: '항목명(영문)' })).toBeInTheDocument()

    expect(screen.getByLabelText('방문지역')).toBeInTheDocument()
    expect(within(location).getAllByRole('button', { name: '신규' }).length).toBe(1)
    expect(within(location).getByText('본관 경비실')).toBeInTheDocument()
    expect(within(device).getByText('노트북')).toBeInTheDocument()
  })
})
