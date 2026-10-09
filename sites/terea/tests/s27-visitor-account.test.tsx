import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LOCAL_VISITOR_SEED } from '../src/auth/visitorAccounts'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S27: 로컬 방문 테스트 계정', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('로컬 방문 테스트 계정으로 신청 조회가 가능하고 README에 명시된다', async () => {
    expect(LOCAL_VISITOR_SEED.name).toBeTruthy()
    expect(LOCAL_VISITOR_SEED.phone).toBeTruthy()

    const readme = readFileSync(resolve(__dirname, '../README.md'), 'utf8')
    expect(readme).toContain(LOCAL_VISITOR_SEED.name)
    expect(readme).toContain(LOCAL_VISITOR_SEED.phone)
    expect(readme).toMatch(/방문 테스트 계정|로컬 방문/)

    const user = userEvent.setup()
    renderWithRouter(<App />, ['/lookup'])
    await user.type(screen.getByLabelText(/성명/), LOCAL_VISITOR_SEED.name)
    await user.type(screen.getByLabelText(/휴대전화/), LOCAL_VISITOR_SEED.phone)
    await user.click(screen.getByRole('button', { name: '조회' }))
    expect(screen.getByText(LOCAL_VISITOR_SEED.name)).toBeInTheDocument()
    expect(screen.getByText(/대기|승인|반려/)).toBeInTheDocument()
  })
})
