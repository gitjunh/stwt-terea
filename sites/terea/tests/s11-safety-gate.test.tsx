import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S11: 안전서약서 동의 후 진행', () => {
  it('미동의 시 진행 불가하고, 동의 후 방문정보 입력으로 이동한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/safety'])
    const next = screen.getByRole('button', { name: /동의 후 진행|다음/ })
    expect(next).toBeDisabled()
    await user.click(screen.getByLabelText(/내용 확인 후 동의/))
    expect(next).toBeEnabled()
    await user.click(next)
    expect(screen.getByRole('heading', { name: /방문정보/ })).toBeInTheDocument()
  })
})
