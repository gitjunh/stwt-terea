# S17 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s17-admin-login.test.tsx`
- 결과: failed: true
- 요약: 로컬 계정 로그인 후 방문자 현황 미이동. 구현 전.

## 구현
- `LOCAL_ADMIN_SEED` (terea-admin / terea-admin-local-01) + session 인증.
- 로그인 성공 → `/manager/visitors`(방문자 현황 골격).
- README에 로컬 관리 테스트 계정 명시. 원본 운영 계정 아님.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s17-admin-login.test.tsx`
- 결과: passed
