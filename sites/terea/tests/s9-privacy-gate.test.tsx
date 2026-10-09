import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S9: 개인정보 동의 후 진행', () => {
  it('필수 미동의 시 진행 불가하고, 동의 후 다음으로 간다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/privacy'])
    const next = screen.getByRole('button', { name: '동의하고 다음' })
    expect(next).toBeDisabled()
    await user.click(screen.getByLabelText(/개인정보 수집 및 이용/))
    await user.click(screen.getByLabelText(/방문기록 관리 및 출입 확인/))
    await user.click(screen.getByLabelText(/개인정보 보관 안내 확인/))
    expect(next).toBeEnabled()
    await user.click(next)
    expect(screen.getByRole('heading', { name: /안전서약서/ })).toBeInTheDocument()
  })
})
