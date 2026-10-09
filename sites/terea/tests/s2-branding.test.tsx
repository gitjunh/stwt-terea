import { screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { renderWithRouter } from './test-utils'

describe('S2: terea 표기', () => {
  it('초기 화면에 terea가 보이고 kemco/KEMCO/켐코가 없다', () => {
    const { container } = renderWithRouter(<App />)
    expect(screen.getAllByText(/terea/i).length).toBeGreaterThan(0)
    expect(container.textContent).not.toMatch(/kemco/i)
    expect(container.textContent).not.toMatch(/켐코/)
  })

  it('문서 title·meta에 terea 방문 브랜드가 있고 kemco가 없다', () => {
    renderWithRouter(<App />)

    expect(document.title).toMatch(/terea/i)
    expect(document.title).toMatch(/방문/)
    expect(document.title).not.toMatch(/vite/i)
    expect(document.title).not.toMatch(/kemco/i)

    const metaDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content')
    expect(metaDescription).toMatch(/terea/i)
    expect(metaDescription).toMatch(/방문/)
    expect(metaDescription).not.toMatch(/kemco/i)

    const indexHtml = readFileSync(resolve(__dirname, '../index.html'), 'utf8')
    expect(indexHtml).toMatch(/<title>[^<]*terea[^<]*<\/title>/i)
    expect(indexHtml).toMatch(/name="description"[^>]*content="[^"]*terea/i)
    expect(indexHtml).not.toMatch(/kemco/i)
  })
})
