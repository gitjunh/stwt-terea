import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { readDraft } from '../src/store/applyDraft'
import { renderWithRouter } from './test-utils'

describe('S33: 방문 장소 다중 선택', () => {
  it('여러 장소를 선택한 뒤 다음으로 넘기면 draft에 모두 남는다', async () => {
    const user = userEvent.setup()
    window.sessionStorage.clear()
    renderWithRouter(<App />, ['/apply/visit-info'])

    await user.type(screen.getByLabelText(/찾아가시는 분|찾아갈 분/), '담당자')
    await user.click(screen.getByLabelText('올인원제련소 경비실'))
    await user.click(screen.getByLabelText('올인원제련소 본관'))
    await user.click(screen.getByLabelText(/회의참석 및 업무협의/))
    await user.click(screen.getByRole('button', { name: /다음.*방문자 정보/ }))

    expect(screen.getByRole('heading', { name: '방문자 정보' })).toBeInTheDocument()
    const draft = readDraft()
    expect(draft.locations).toEqual(['올인원제련소 경비실', '올인원제련소 본관'])
  })
})
