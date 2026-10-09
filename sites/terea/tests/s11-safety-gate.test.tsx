import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S11: 안전서약서 동의 후 진행', () => {
  it('미동의 시 주황 안내가 뜨고, 동의 후 방문 정보로 이동한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/safety'])

    const agreeBtn = screen.getByRole('button', { name: '동의합니다' })
    await user.click(agreeBtn)
    expect(screen.getByRole('status')).toHaveTextContent(/안전 서약서에 동의해주십시오/)
    expect(screen.queryByRole('heading', { name: '방문 정보' })).not.toBeInTheDocument()

    const radios = screen.getAllByRole('radio', { name: '동의합니다.' })
    await user.click(radios[0])
    await user.click(agreeBtn)
    expect(screen.getByRole('heading', { name: '방문 정보' })).toBeInTheDocument()
  })
})
