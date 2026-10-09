import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S9: 개인정보 동의 후 진행', () => {
  it('필수 미동의 시 진행 불가하고, 동의 후 다음으로 간다', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    renderWithRouter(<App />, ['/apply/privacy'])

    const agreeBtn = screen.getByRole('button', { name: '동의합니다' })
    await user.click(agreeBtn)
    expect(alertSpy).toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: /안전서약서/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /모두 동의합니다/ }))
    await user.click(agreeBtn)
    expect(screen.getByRole('heading', { name: /안전서약서/ })).toBeInTheDocument()
    alertSpy.mockRestore()
  })
})
