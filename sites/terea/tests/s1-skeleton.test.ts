import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '..')

describe('S1: 사이트 경로 골격', () => {
  it('sites/terea 로컬 앱 진입점이 있다', () => {
    expect(existsSync(resolve(root, 'index.html'))).toBe(true)
    expect(existsSync(resolve(root, 'src/main.tsx'))).toBe(true)
    expect(existsSync(resolve(root, 'src/App.tsx'))).toBe(true)
  })
})
