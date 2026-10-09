# S22 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s22-visit-approve.test.tsx`
- 결과: failed: true
- 요약: 승인 버튼·상태 변경 부재. 구현 전.

## 구현
- `updateApplicationStatus`로 진행상태 승인 반영.
- 방문 승인 목록의 대기 건에 「승인」버튼.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s22-visit-approve.test.tsx`
- 결과: passed
