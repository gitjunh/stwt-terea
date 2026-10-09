# S16 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s16-admin-login-ui.test.tsx`
- 결과: failed: true
- 요약: `/manager/login` 로그인 UI 부재. 구현 전.

## 구현
- AdminLogin: ID·PW 입력 폼(로그인 성공은 S17).

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s16-admin-login-ui.test.tsx`
- 결과: passed
