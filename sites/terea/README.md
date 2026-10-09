# terea 방문·관리

Vite + React + TypeScript + SQLite API. 원본 운영 사이트 계정은 사용하지 않습니다.

## GitHub Pages (웹에서 바로 사용)

배포 URL: **https://gitjunh.github.io/stw-terea/**

- 프론트만 호스팅됩니다. 관리·방문 데이터는 브라우저 `localStorage` 폴백으로 동작합니다.
- SQLite API(승인·CRUD 서버)는 Pages에서 돌지 않습니다. 전체 API 테스트는 아래 로컬 실행을 쓰세요.

저장소 Settings → Pages → Source를 **GitHub Actions**로 두면 `main`/`master` 푸시마다 자동 배포됩니다.

## 로컬 실행

```bash
npm install
npm run db:seed          # server/data/terea.sqlite 생성·시드
npm run dev:all          # Vite(프론트) + API(8787)
# 또는 분리 실행:
# npm run dev:server
# npm run dev
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 프론트만 (Vite, `/api` → `127.0.0.1:8787` 프록시) |
| `npm run dev:server` | SQLite HTTP API (포트 8787) |
| `npm run dev:all` | 프론트+API 동시 |
| `npm run db:seed` | DB 재생성·시드 (`--reset`) |
| `npm run build:pages` | GitHub Pages용 빌드 (`/stw-terea/` base) |
| `npm test` | Vitest (jsdom, 로컬 스토어 폴백) |
| `npm run test:server` | API 스모크 (health·login·권한그룹) |

## 로컬 관리 테스트 계정

시드: DB `users` / `src/auth/adminAccounts.ts` (`LOCAL_ADMIN_SEED`)

| 항목 | 값 |
| --- | --- |
| ID | `terea-admin` |
| PW | `terea-admin-local-01` |

관리 로그인: `/manager/login`

## 로컬 방문 테스트 계정

시드: `src/auth/visitorAccounts.ts` (`LOCAL_VISITOR_SEED`). 원본 운영 계정 아님.

| 항목 | 값 |
| --- | --- |
| 성명 | `terea방문테스터` |
| 휴대전화 | `01022223333` |

방문 신청·조회(`/lookup`) 테스트에 사용. 시드 신청이 SQLite·로컬 스토리지에 포함됩니다.

## 관리자 사이트맵

| 그룹 | 메뉴 | 경로 |
| --- | --- | --- |
| 시스템관리 | 사용자 관리 | `/manager/users` |
| 시스템관리 | 권한그룹 관리 | `/manager/permission-groups` |
| 시스템관리 | 부서 관리 | `/manager/departments` |
| 시스템관리 | 기초코드 관리 | `/manager/codes` |
| 방문자 관리 | 방문 승인 | `/manager/approvals` |
| 방문자 관리 | 차량 승인 | `/manager/vehicles` |
| 방문자 관리 | 방문자 현황 | `/manager/visitors` |
| 방문카드 관리 | 방문카드 발급/반납 | `/manager/visit-cards` |
| 방문카드 관리 | 방문카드 발급/반납 조회 | `/manager/visit-cards/history` |
| 방문카드 관리 | 방문자 출입이력 | `/manager/access-logs` |

## DB

- 엔진: Node 내장 `node:sqlite` (`DatabaseSync`)
- 파일: `server/data/terea.sqlite` (gitignore)
- API: `http://127.0.0.1:8787` — `/api/health`, `/api/auth/login`, `/api/applications`, `/api/users`, `/api/permission-groups`, `/api/permissions`, `/api/departments`, `/api/codes`, `/api/visit-cards`, `/api/access-logs`
