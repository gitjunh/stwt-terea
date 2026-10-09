# S15 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s15-submit.test.tsx`
- 결과: failed: true
- 요약: 제출 버튼·완료 안내 부재. 구현 전.

## 구현
- VisitInfo 제출 시 localStorage 저장 후 `/apply/complete`.
- ApplicationComplete: 신청 완료·접수 안내.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s15-submit.test.tsx`
- 결과: passed
