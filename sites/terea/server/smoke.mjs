/**
 * API smoke: seed → health → login → list permission-groups.
 * Exit 0 on success.
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openDb, migrate, DB_PATH } from './db.mjs'
import { seed } from './seed.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = 8799

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const db = openDb()
  migrate(db)
  seed(db)
  db.close()

  const child = spawn(
    process.execPath,
    ['--experimental-sqlite', join(__dirname, 'index.mjs')],
    {
      env: { ...process.env, TEREA_API_PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  let ready = false
  child.stdout.on('data', (d) => {
    if (String(d).includes('listening')) ready = true
  })
  child.stderr.on('data', (d) => process.stderr.write(d))

  for (let i = 0; i < 40 && !ready; i++) await wait(100)
  if (!ready) {
    child.kill()
    throw new Error('server did not start')
  }

  try {
    const health = await fetch(`http://127.0.0.1:${PORT}/api/health`)
    if (!health.ok) throw new Error('health failed')
    const login = await fetch(`http://127.0.0.1:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'terea-admin', password: 'terea-admin-local-01' }),
    })
    if (!login.ok) throw new Error('login failed')
    const groups = await fetch(`http://127.0.0.1:${PORT}/api/permission-groups`)
    const data = await groups.json()
    if (!Array.isArray(data) || data.length < 4) throw new Error('groups seed missing')
    console.log('smoke ok', { db: DB_PATH, groups: data.length })
  } finally {
    child.kill()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
