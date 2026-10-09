# S27 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s27-visitor-account.test.tsx`
- 결과: failed: true
- 요약: LOCAL_VISITOR_SEED·README·시드 신청 부재. 구현 전.

## 구현
- `visitorAccounts.ts` 로컬 방문 시드 + applications STUB 반영.
- README에 성명·휴대전화 명시. 원본 계정 아님.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s27-visitor-account.test.tsx`
- 결과: passed
