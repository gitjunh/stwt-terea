import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S14: 얼굴 사진 등록', () => {
  it('방문자 정보에서 안면 인식용 얼굴 사진을 등록할 수 있다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/apply/visitor-info'])
    expect(screen.getByText(/방문자 사진|얼굴 사진|안면/)).toBeInTheDocument()
    const fileInput = screen.getByLabelText(/사진 등록|얼굴 사진|파일 선택/)
    expect(fileInput).toBeInTheDocument()
    const file = new File(['face'], 'face.jpg', { type: 'image/jpeg' })
    await user.upload(fileInput, file)
    expect((fileInput as HTMLInputElement).files?.[0]?.name).toBe('face.jpg')
  })
})
