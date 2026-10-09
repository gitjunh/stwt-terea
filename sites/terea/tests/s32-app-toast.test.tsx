import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S32: 원본형 주황 안내 배너', () => {
  it('안전서약서에서 동의하지 않습니다 선택 후 진행 시 배너가 보인다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/safety'])

    await user.click(screen.getByRole('radio', { name: '동의하지 않습니다.' }))
    await user.click(screen.getByRole('button', { name: '동의합니다' }))
    expect(screen.getByRole('status')).toHaveTextContent('안전 서약서에 동의해주십시오.')
  })
})
