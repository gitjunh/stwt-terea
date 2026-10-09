import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const DATA_DIR = join(__dirname, 'data')
export const DB_PATH = join(DATA_DIR, 'terea.sqlite')

export function openDb(path = DB_PATH) {
  mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON')
  return db
}

export function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      group_code TEXT,
      department_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS permission_groups (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_code TEXT NOT NULL,
      menu_name TEXT NOT NULL,
      permission_name TEXT NOT NULL,
      allowed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(group_code, menu_name, permission_name),
      FOREIGN KEY (group_code) REFERENCES permission_groups(code) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      UNIQUE(category, code)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT '대기',
      company TEXT,
      visit_at TEXT,
      visit_type TEXT,
      purpose TEXT,
      host TEXT,
      vehicle TEXT,
      vehicle_status TEXT,
      face_photo_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id TEXT NOT NULL UNIQUE,
      plate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT '대기',
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS visit_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_no TEXT NOT NULL UNIQUE,
      visitor_name TEXT NOT NULL,
      phone TEXT,
      application_id TEXT,
      status TEXT NOT NULL DEFAULT '대기',
      issued_at TEXT,
      returned_at TEXT
    );

    CREATE TABLE IF NOT EXISTS access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_name TEXT NOT NULL,
      card_no TEXT,
      direction TEXT NOT NULL,
      logged_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS link_sends (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      sent_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS qr_notices (
      application_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)
}

export function rowToApplication(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    status: row.status,
    company: row.company ?? undefined,
    visitAt: row.visit_at ?? undefined,
    visitType: row.visit_type ?? undefined,
    purpose: row.purpose ?? undefined,
    host: row.host ?? undefined,
    vehicle: row.vehicle ?? undefined,
    vehicleStatus: row.vehicle_status ?? undefined,
    facePhotoName: row.face_photo_name ?? undefined,
  }
}
