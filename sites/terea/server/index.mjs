import { createServer } from 'node:http'
import { openDb, migrate, DB_PATH, rowToApplication } from './db.mjs'
import { seed } from './seed.mjs'

const PORT = Number(process.env.TEREA_API_PORT || 8787)

const db = openDb()
migrate(db)
seed(db)

function send(res, status, body, extraHeaders = {}) {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  })
  res.end(json)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function match(pathname, pattern) {
  const pp = pattern.split('/').filter(Boolean)
  const sp = pathname.split('/').filter(Boolean)
  if (pp.length !== sp.length) return null
  const params = {}
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(sp[i])
    else if (pp[i] !== sp[i]) return null
  }
  return params
}

function listApplications() {
  return db
    .prepare('SELECT * FROM applications ORDER BY visit_at DESC, id')
    .all()
    .map(rowToApplication)
}

function upsertVehicleFromApp(app) {
  if (!app.vehicle) return
  const existing = db.prepare('SELECT id FROM vehicles WHERE application_id = ?').get(app.id)
  if (existing) {
    db.prepare('UPDATE vehicles SET plate = ?, status = ? WHERE application_id = ?').run(
      app.vehicle,
      app.vehicleStatus || '대기',
      app.id,
    )
  } else {
    db.prepare('INSERT INTO vehicles (application_id, plate, status) VALUES (?, ?, ?)').run(
      app.id,
      app.vehicle,
      app.vehicleStatus || '대기',
    )
  }
}

async function handle(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`)
  const { pathname } = url
  const method = req.method || 'GET'

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    return res.end()
  }

  try {
    if (method === 'GET' && pathname === '/api/health') {
      return send(res, 200, { ok: true, db: DB_PATH })
    }

    if (method === 'POST' && pathname === '/api/auth/login') {
      const body = await readBody(req)
      const user = db
        .prepare('SELECT id, username, name, group_code FROM users WHERE username = ? AND password = ?')
        .get(String(body.id || body.username || '').trim(), String(body.password || ''))
      if (!user) return send(res, 401, { error: 'invalid_credentials' })
      return send(res, 200, {
        ok: true,
        user: {
          id: user.username,
          name: user.name,
          groupCode: user.group_code,
        },
      })
    }

    // —— applications ——
    if (method === 'GET' && pathname === '/api/applications') {
      const vehiclesOnly = url.searchParams.get('vehicles') === '1'
      let rows = listApplications()
      if (vehiclesOnly) rows = rows.filter((r) => Boolean(r.vehicle))
      return send(res, 200, rows)
    }

    if (method === 'POST' && pathname === '/api/applications') {
      const body = await readBody(req)
      const id = body.id || `app-${Date.now()}`
      db.prepare(`
        INSERT INTO applications
          (id, name, phone, status, company, visit_at, visit_type, purpose, host, vehicle, vehicle_status, face_photo_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        body.name,
        body.phone,
        body.status || '대기',
        body.company ?? null,
        body.visitAt ?? null,
        body.visitType ?? null,
        body.purpose ?? null,
        body.host ?? null,
        body.vehicle ?? null,
        body.vehicleStatus ?? (body.vehicle ? '대기' : null),
        body.facePhotoName ?? null,
      )
      const app = rowToApplication(db.prepare('SELECT * FROM applications WHERE id = ?').get(id))
      upsertVehicleFromApp(app)
      return send(res, 201, app)
    }

    let params = match(pathname, '/api/applications/:id/approve')
    if (method === 'POST' && params) {
      db.prepare(`UPDATE applications SET status = '승인' WHERE id = ?`).run(params.id)
      const app = rowToApplication(db.prepare('SELECT * FROM applications WHERE id = ?').get(params.id))
      if (!app) return send(res, 404, { error: 'not_found' })
      const notice = {
        applicationId: app.id,
        name: app.name,
        phone: app.phone,
        code: `TEREA-QR-${app.id}`,
        message: '방문 승인 QR 안내(로컬 표시, 실SMS 대체)',
        createdAt: new Date().toISOString(),
      }
      db.prepare(`
        INSERT INTO qr_notices (application_id, name, phone, code, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(application_id) DO UPDATE SET
          name=excluded.name, phone=excluded.phone, code=excluded.code,
          message=excluded.message, created_at=excluded.created_at
      `).run(notice.applicationId, notice.name, notice.phone, notice.code, notice.message, notice.createdAt)
      return send(res, 200, { application: app, notice })
    }

    params = match(pathname, '/api/applications/:id/reject')
    if (method === 'POST' && params) {
      db.prepare(`UPDATE applications SET status = '반려' WHERE id = ?`).run(params.id)
      const app = rowToApplication(db.prepare('SELECT * FROM applications WHERE id = ?').get(params.id))
      if (!app) return send(res, 404, { error: 'not_found' })
      return send(res, 200, app)
    }

    params = match(pathname, '/api/applications/:id/vehicle')
    if (method === 'POST' && params) {
      const body = await readBody(req)
      const status = body.vehicleStatus || body.status || '승인'
      db.prepare(`UPDATE applications SET vehicle_status = ? WHERE id = ?`).run(status, params.id)
      db.prepare(`UPDATE vehicles SET status = ? WHERE application_id = ?`).run(status, params.id)
      const app = rowToApplication(db.prepare('SELECT * FROM applications WHERE id = ?').get(params.id))
      if (!app) return send(res, 404, { error: 'not_found' })
      return send(res, 200, app)
    }

    params = match(pathname, '/api/applications/:id')
    if (params && method === 'PATCH') {
      const body = await readBody(req)
      const cur = db.prepare('SELECT * FROM applications WHERE id = ?').get(params.id)
      if (!cur) return send(res, 404, { error: 'not_found' })
      db.prepare(`
        UPDATE applications SET
          name = ?, phone = ?, status = ?, company = ?, visit_at = ?, visit_type = ?,
          purpose = ?, host = ?, vehicle = ?, vehicle_status = ?, face_photo_name = ?
        WHERE id = ?
      `).run(
        body.name ?? cur.name,
        body.phone ?? cur.phone,
        body.status ?? cur.status,
        body.company ?? cur.company,
        body.visitAt ?? cur.visit_at,
        body.visitType ?? cur.visit_type,
        body.purpose ?? cur.purpose,
        body.host ?? cur.host,
        body.vehicle ?? cur.vehicle,
        body.vehicleStatus ?? cur.vehicle_status,
        body.facePhotoName ?? cur.face_photo_name,
        params.id,
      )
      const app = rowToApplication(db.prepare('SELECT * FROM applications WHERE id = ?').get(params.id))
      upsertVehicleFromApp(app)
      return send(res, 200, app)
    }

    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM applications WHERE id = ?').run(params.id)
      return send(res, 200, { ok: true })
    }

    // —— users ——
    if (pathname === '/api/users' && method === 'GET') {
      const rows = db
        .prepare(
          `SELECT u.id, u.username, u.name, u.group_code AS groupCode, u.department_id AS departmentId, u.created_at AS createdAt
           FROM users u ORDER BY u.id`,
        )
        .all()
      return send(res, 200, rows)
    }
    if (pathname === '/api/users' && method === 'POST') {
      const body = await readBody(req)
      const info = db
        .prepare(
          'INSERT INTO users (username, password, name, group_code, department_id) VALUES (?, ?, ?, ?, ?)',
        )
        .run(
          body.username,
          body.password || 'change-me',
          body.name || body.username,
          body.groupCode ?? null,
          body.departmentId ?? null,
        )
      const row = db
        .prepare(
          `SELECT id, username, name, group_code AS groupCode, department_id AS departmentId, created_at AS createdAt
           FROM users WHERE id = ?`,
        )
        .get(Number(info.lastInsertRowid))
      return send(res, 201, row)
    }
    params = match(pathname, '/api/users/:id')
    if (params && method === 'PUT') {
      const body = await readBody(req)
      db.prepare(
        'UPDATE users SET username = ?, name = ?, group_code = ?, department_id = ? WHERE id = ?',
      ).run(body.username, body.name, body.groupCode ?? null, body.departmentId ?? null, Number(params.id))
      if (body.password) {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(body.password, Number(params.id))
      }
      const row = db
        .prepare(
          `SELECT id, username, name, group_code AS groupCode, department_id AS departmentId, created_at AS createdAt
           FROM users WHERE id = ?`,
        )
        .get(Number(params.id))
      return send(res, 200, row)
    }
    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM users WHERE id = ?').run(Number(params.id))
      return send(res, 200, { ok: true })
    }

    // —— permission groups ——
    if (pathname === '/api/permission-groups' && method === 'GET') {
      return send(res, 200, db.prepare('SELECT code, name FROM permission_groups ORDER BY code').all())
    }
    if (pathname === '/api/permission-groups' && method === 'POST') {
      const body = await readBody(req)
      db.prepare('INSERT INTO permission_groups (code, name) VALUES (?, ?)').run(body.code, body.name)
      return send(res, 201, { code: body.code, name: body.name })
    }
    params = match(pathname, '/api/permission-groups/:code')
    if (params && method === 'PUT') {
      const body = await readBody(req)
      db.prepare('UPDATE permission_groups SET name = ? WHERE code = ?').run(body.name, params.code)
      return send(res, 200, { code: params.code, name: body.name })
    }
    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM permissions WHERE group_code = ?').run(params.code)
      db.prepare('DELETE FROM permission_groups WHERE code = ?').run(params.code)
      return send(res, 200, { ok: true })
    }

    // —— permissions ——
    if (pathname === '/api/permissions' && method === 'GET') {
      const groupCode = url.searchParams.get('groupCode')
      if (!groupCode) return send(res, 400, { error: 'groupCode_required' })
      const rows = db
        .prepare(
          `SELECT id, group_code AS groupCode, menu_name AS menuName,
                  permission_name AS permissionName, allowed
           FROM permissions WHERE group_code = ? ORDER BY id`,
        )
        .all(groupCode)
        .map((r) => ({ ...r, allowed: Boolean(r.allowed) }))
      return send(res, 200, rows)
    }
    if (pathname === '/api/permissions' && method === 'PUT') {
      const body = await readBody(req)
      const groupCode = body.groupCode
      const items = body.items || []
      const upd = db.prepare('UPDATE permissions SET allowed = ? WHERE id = ? AND group_code = ?')
      for (const item of items) {
        upd.run(item.allowed ? 1 : 0, item.id, groupCode)
      }
      return send(res, 200, { ok: true })
    }

    // —— departments ——
    if (pathname === '/api/departments' && method === 'GET') {
      return send(res, 200, db.prepare('SELECT id, code, name FROM departments ORDER BY id').all())
    }
    if (pathname === '/api/departments' && method === 'POST') {
      const body = await readBody(req)
      const info = db.prepare('INSERT INTO departments (code, name) VALUES (?, ?)').run(body.code, body.name)
      return send(res, 201, { id: Number(info.lastInsertRowid), code: body.code, name: body.name })
    }
    params = match(pathname, '/api/departments/:id')
    if (params && method === 'PUT') {
      const body = await readBody(req)
      db.prepare('UPDATE departments SET code = ?, name = ? WHERE id = ?').run(
        body.code,
        body.name,
        Number(params.id),
      )
      return send(res, 200, { id: Number(params.id), code: body.code, name: body.name })
    }
    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM departments WHERE id = ?').run(Number(params.id))
      return send(res, 200, { ok: true })
    }

    // —— codes ——
    if (pathname === '/api/codes' && method === 'GET') {
      return send(
        res,
        200,
        db
          .prepare(
            `SELECT id, category, code, name, sort_order AS sortOrder FROM codes ORDER BY category, sort_order, id`,
          )
          .all(),
      )
    }
    if (pathname === '/api/codes' && method === 'POST') {
      const body = await readBody(req)
      const info = db
        .prepare('INSERT INTO codes (category, code, name, sort_order) VALUES (?, ?, ?, ?)')
        .run(body.category, body.code, body.name, body.sortOrder ?? 0)
      return send(res, 201, {
        id: Number(info.lastInsertRowid),
        category: body.category,
        code: body.code,
        name: body.name,
        sortOrder: body.sortOrder ?? 0,
      })
    }
    params = match(pathname, '/api/codes/:id')
    if (params && method === 'PUT') {
      const body = await readBody(req)
      db.prepare('UPDATE codes SET category = ?, code = ?, name = ?, sort_order = ? WHERE id = ?').run(
        body.category,
        body.code,
        body.name,
        body.sortOrder ?? 0,
        Number(params.id),
      )
      return send(res, 200, {
        id: Number(params.id),
        category: body.category,
        code: body.code,
        name: body.name,
        sortOrder: body.sortOrder ?? 0,
      })
    }
    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM codes WHERE id = ?').run(Number(params.id))
      return send(res, 200, { ok: true })
    }

    // —— visit cards ——
    if (pathname === '/api/visit-cards' && method === 'GET') {
      return send(
        res,
        200,
        db
          .prepare(
            `SELECT id, card_no AS cardNo, visitor_name AS visitorName, phone,
                    application_id AS applicationId, status, issued_at AS issuedAt, returned_at AS returnedAt
             FROM visit_cards ORDER BY id DESC`,
          )
          .all(),
      )
    }
    if (pathname === '/api/visit-cards' && method === 'POST') {
      const body = await readBody(req)
      const info = db
        .prepare(
          `INSERT INTO visit_cards (card_no, visitor_name, phone, application_id, status, issued_at, returned_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          body.cardNo,
          body.visitorName,
          body.phone ?? null,
          body.applicationId ?? null,
          body.status || '발급',
          body.issuedAt || new Date().toISOString(),
          body.returnedAt ?? null,
        )
      const row = db
        .prepare(
          `SELECT id, card_no AS cardNo, visitor_name AS visitorName, phone,
                  application_id AS applicationId, status, issued_at AS issuedAt, returned_at AS returnedAt
           FROM visit_cards WHERE id = ?`,
        )
        .get(Number(info.lastInsertRowid))
      return send(res, 201, row)
    }
    params = match(pathname, '/api/visit-cards/:id')
    if (params && method === 'PUT') {
      const body = await readBody(req)
      db.prepare(
        `UPDATE visit_cards SET card_no = ?, visitor_name = ?, phone = ?, application_id = ?,
         status = ?, issued_at = ?, returned_at = ? WHERE id = ?`,
      ).run(
        body.cardNo,
        body.visitorName,
        body.phone ?? null,
        body.applicationId ?? null,
        body.status,
        body.issuedAt ?? null,
        body.returnedAt ?? null,
        Number(params.id),
      )
      const row = db
        .prepare(
          `SELECT id, card_no AS cardNo, visitor_name AS visitorName, phone,
                  application_id AS applicationId, status, issued_at AS issuedAt, returned_at AS returnedAt
           FROM visit_cards WHERE id = ?`,
        )
        .get(Number(params.id))
      return send(res, 200, row)
    }
    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM visit_cards WHERE id = ?').run(Number(params.id))
      return send(res, 200, { ok: true })
    }

    // —— access logs ——
    if (pathname === '/api/access-logs' && method === 'GET') {
      return send(
        res,
        200,
        db
          .prepare(
            `SELECT id, visitor_name AS visitorName, card_no AS cardNo, direction, logged_at AS loggedAt
             FROM access_logs ORDER BY logged_at DESC, id DESC`,
          )
          .all(),
      )
    }
    if (pathname === '/api/access-logs' && method === 'POST') {
      const body = await readBody(req)
      const loggedAt = body.loggedAt || new Date().toISOString()
      const info = db
        .prepare(
          'INSERT INTO access_logs (visitor_name, card_no, direction, logged_at) VALUES (?, ?, ?, ?)',
        )
        .run(body.visitorName, body.cardNo ?? null, body.direction, loggedAt)
      return send(res, 201, {
        id: Number(info.lastInsertRowid),
        visitorName: body.visitorName,
        cardNo: body.cardNo ?? null,
        direction: body.direction,
        loggedAt,
      })
    }
    params = match(pathname, '/api/access-logs/:id')
    if (params && method === 'DELETE') {
      db.prepare('DELETE FROM access_logs WHERE id = ?').run(Number(params.id))
      return send(res, 200, { ok: true })
    }

    // —— qr notices / link sends (optional) ——
    if (pathname === '/api/qr-notices' && method === 'GET') {
      return send(
        res,
        200,
        db
          .prepare(
            `SELECT application_id AS applicationId, name, phone, code, message, created_at AS createdAt
             FROM qr_notices ORDER BY created_at DESC`,
          )
          .all(),
      )
    }
    if (pathname === '/api/link-sends' && method === 'POST') {
      const body = await readBody(req)
      const id = body.id || `link-${Date.now()}`
      const sentAt = body.sentAt || new Date().toISOString()
      db.prepare('INSERT INTO link_sends (id, phone, message, sent_at) VALUES (?, ?, ?, ?)').run(
        id,
        body.phone,
        body.message,
        sentAt,
      )
      return send(res, 201, { id, phone: body.phone, message: body.message, sentAt })
    }

    return send(res, 404, { error: 'not_found', path: pathname })
  } catch (err) {
    console.error(err)
    return send(res, 500, { error: 'server_error', message: String(err?.message || err) })
  }
}

const server = createServer((req, res) => {
  handle(req, res)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`terea API listening on http://127.0.0.1:${PORT}`)
  console.log(`SQLite: ${DB_PATH}`)
})
