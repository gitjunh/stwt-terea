import { unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openDb, migrate, DB_PATH } from './db.mjs'

const MENUS = [
  ['사용자 관리', ['조회', '편집']],
  ['권한그룹 관리', ['조회', '편집']],
  ['부서 관리', ['조회', '편집']],
  ['기초코드 관리', ['조회', '편집']],
  ['방문 승인', ['조회', '편집', '문자전송']],
  ['차량 승인', ['조회', '편집']],
  ['방문자 현황', ['조회', '편집']],
  ['방문카드 발급/반납', ['조회', '편집']],
  ['방문카드 발급/반납 조회', ['조회']],
  ['방문자 출입이력', ['조회']],
]

export function seed(db, { reset = false } = {}) {
  if (reset) {
    for (const table of [
      'qr_notices',
      'link_sends',
      'access_logs',
      'visit_cards',
      'vehicles',
      'applications',
      'permissions',
      'users',
      'codes',
      'departments',
      'permission_groups',
    ]) {
      db.exec(`DELETE FROM ${table}`)
    }
  }

  const groupCount = db.prepare('SELECT COUNT(*) AS c FROM permission_groups').get().c
  if (groupCount === 0) {
    const insertGroup = db.prepare('INSERT INTO permission_groups (code, name) VALUES (?, ?)')
    const groups = [
      ['1001', '관리자'],
      ['1002', '담당자'],
      ['1003', '결재자'],
      ['1004', 'STEC'],
    ]
    for (const g of groups) insertGroup.run(...g)

    const insertPerm = db.prepare(
      'INSERT INTO permissions (group_code, menu_name, permission_name, allowed) VALUES (?, ?, ?, ?)',
    )
    for (const [code] of groups) {
      for (const [menu, perms] of MENUS) {
        for (const p of perms) {
          insertPerm.run(code, menu, p, code === '1001' ? 1 : 0)
        }
      }
    }
  }

  const deptCount = db.prepare('SELECT COUNT(*) AS c FROM departments').get().c
  if (deptCount === 0) {
    const insertDept = db.prepare('INSERT INTO departments (code, name) VALUES (?, ?)')
    insertDept.run('D001', '경영지원')
    insertDept.run('D002', '시설관리')
    insertDept.run('D003', '보안')
  }

  const codeCount = db.prepare('SELECT COUNT(*) AS c FROM codes').get().c
  if (codeCount === 0) {
    const insertCode = db.prepare(
      'INSERT INTO codes (category, code, name, sort_order) VALUES (?, ?, ?, ?)',
    )
    insertCode.run('VISIT_TYPE', 'GENERAL', '일반', 1)
    insertCode.run('VISIT_TYPE', 'WORK', '업무', 2)
    insertCode.run('VISIT_TYPE', 'CONSTRUCTION', '공사', 3)
    insertCode.run('PURPOSE', 'MEETING', '미팅', 1)
    insertCode.run('PURPOSE', 'INSPECT', '점검', 2)
  }

  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c
  if (userCount === 0) {
    db.prepare(
      'INSERT INTO users (username, password, name, group_code, department_id) VALUES (?, ?, ?, ?, ?)',
    ).run('terea-admin', 'terea-admin-local-01', '관리자', '1001', 1)
  }

  const appCount = db.prepare('SELECT COUNT(*) AS c FROM applications').get().c
  if (appCount === 0) {
    const insertApp = db.prepare(`
      INSERT INTO applications
        (id, name, phone, status, company, visit_at, visit_type, purpose, host, vehicle, vehicle_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    insertApp.run(
      'stub-visitor-local',
      'terea방문테스터',
      '01022223333',
      '대기',
      'terea 로컬테스트',
      '2026-10-20T10:00',
      '일반',
      '로컬 방문 테스트',
      '테스트담당',
      null,
      null,
    )
    insertApp.run(
      'stub-1',
      '홍길동',
      '01012345678',
      '승인',
      'terea 파트너',
      '2026-10-10T09:00',
      '일반',
      '미팅',
      '김담당',
      null,
      null,
    )
    insertApp.run(
      'stub-2',
      '김대기',
      '01099998888',
      '대기',
      '외부업체A',
      '2026-10-12T14:00',
      '업무',
      '점검',
      '이담당',
      '12가3456',
      '대기',
    )
    insertApp.run(
      'stub-3',
      '이반려',
      '01077776666',
      '반려',
      '외부업체B',
      '2026-10-08T11:00',
      '공사',
      '공사',
      '박담당',
      null,
      null,
    )

    db.prepare('INSERT INTO vehicles (application_id, plate, status) VALUES (?, ?, ?)').run(
      'stub-2',
      '12가3456',
      '대기',
    )
  }

  const cardCount = db.prepare('SELECT COUNT(*) AS c FROM visit_cards').get().c
  if (cardCount === 0) {
    db.prepare(
      `INSERT INTO visit_cards (card_no, visitor_name, phone, application_id, status, issued_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run('VC-1001', '홍길동', '01012345678', 'stub-1', '발급', '2026-10-10T09:30:00')
  }

  const logCount = db.prepare('SELECT COUNT(*) AS c FROM access_logs').get().c
  if (logCount === 0) {
    db.prepare(
      'INSERT INTO access_logs (visitor_name, card_no, direction, logged_at) VALUES (?, ?, ?, ?)',
    ).run('홍길동', 'VC-1001', '입장', '2026-10-10T09:35:00')
  }
}

function main() {
  const reset = process.argv.includes('--reset')
  if (reset && existsSync(DB_PATH)) {
    unlinkSync(DB_PATH)
  }
  const db = openDb()
  migrate(db)
  seed(db, { reset: false })
  console.log(`Seeded SQLite at ${DB_PATH}`)
  db.close()
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  main()
}
