import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('R15: 관리 탭·밝은 UI 텍스트 대비', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    window.localStorage.setItem('terea-dark-mode', '1')
    document.documentElement.dataset.theme = 'dark'
  })

  it('CSS에 관리 탭·셸 light scheme·어두운 라벨색이 명시된다', () => {
    const css = readFileSync(resolve(__dirname, '../src/index.css'), 'utf8')
    expect(css).toMatch(/\.admin-shell\s*\{[^}]*color-scheme:\s*light/s)
    expect(css).toMatch(/\.admin-tab-label\s*\{[^}]*color:\s*inherit/s)
    expect(css).toMatch(/\.admin-tab\s*\{[^}]*color:\s*#1f2937/s)
    expect(css).toMatch(/button,\s*\ninput,\s*\nselect\s*\{[^}]*color:\s*inherit/s)
  })

  it('방문 다크모드가 켜져 있어도 관리 탭 라벨이 렌더된다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/manager/login'])
    await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'terea-admin')
    await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), 'terea-admin-local-01')
    await user.click(screen.getByRole('button', { name: /로그인/ }))
    await user.click(screen.getByRole('link', { name: '사용자 관리' }))
    const tab = screen.getByRole('tab', { selected: true })
    expect(tab).toHaveTextContent('사용자 관리')
    expect(tab.querySelector('.admin-tab-label')).toBeTruthy()
  })
})
