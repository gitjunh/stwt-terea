import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import App from '../src/App'
import { stubMobileViewport } from './mobile-test-utils'
import { renderWithRouter } from './test-utils'

describe('R18: 모바일 화면 대응', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    stubMobileViewport(390)
  })

  it('CSS에 관리 모바일 드로어·탭 nowrap·방문 푸터 여백이 있다', () => {
    const css = readFileSync(resolve(__dirname, '../src/index.css'), 'utf8')
    expect(css).toMatch(/\.admin-shell\.is-mobile \.admin-sidebar/)
    expect(css).toMatch(/admin-sidebar-backdrop/)
    expect(css).toMatch(/\.admin-tab-label\s*\{[^}]*white-space:\s*nowrap/s)
    expect(css).toMatch(/padding-bottom:\s*5\.5rem/)
  })

  it('모바일에서 관리 셸이 is-mobile이고 사이드바는 기본 접힌다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />, ['/manager/login'])
    await user.type(screen.getByLabelText(/ID|아이디|사번/i), 'admin')
    await user.type(screen.getByLabelText(/PW|비밀번호|암호/i), '1234')
    await user.click(screen.getByRole('button', { name: /로그인/ }))
    const shell = document.querySelector('.admin-shell')
    expect(shell).toHaveClass('is-mobile')
    expect(shell).toHaveClass('is-sidebar-collapsed')
    expect(screen.getByRole('button', { name: '사이드바 열기' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '사이드바 열기' }))
    expect(document.querySelector('.admin-shell')).not.toHaveClass('is-sidebar-collapsed')
    expect(screen.getByRole('button', { name: '메뉴 닫기' })).toBeInTheDocument()
  })

  it('모바일 방문 메인·동의 화면이 가로 넘침 없이 렌더된다', () => {
    const { container, unmount } = renderWithRouter(<App />, ['/'])
    expect(document.documentElement.dataset.viewport).toBe('mobile')
    expect(container.querySelector('.main-ctas')).toBeTruthy()
    unmount()
    renderWithRouter(<App />, ['/apply/privacy'])
    expect(screen.getByRole('button', { name: /모두 동의/ })).toBeInTheDocument()
  })
})
