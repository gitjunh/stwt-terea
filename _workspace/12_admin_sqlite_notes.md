# R20 — SQLite 제거 완료

R14에서 두었던 SQLite API·시드·스모크는 R20으로 **전부 제거**했다.

- 삭제: `sites/terea/server/` (`index.mjs`, `db.mjs`, `seed.mjs`, `smoke.mjs`, sqlite 파일)
- 삭제: `dev:server` / `dev:all` / `db:seed` / `test:server`, `concurrently`, Vite `/api` 프록시
- 삭제: `src/api/http.ts` (`tryApiFetch`)
- CI: `db:seed`·API smoke 단계 제거 → `npm test`만
- 데이터: 관리·방문 모두 브라우저 `localStorage` (`adminEntities`, `applications` 등)
