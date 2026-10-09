# S23 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s23-visit-reject.test.tsx`
- 결과: failed: true
- 요약: 반려 버튼 부재. 구현 전.

## 구현
- 방문 승인 목록 대기 건에 「반려」버튼 → 진행상태 반려.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s23-visit-reject.test.tsx`
- 결과: passed
