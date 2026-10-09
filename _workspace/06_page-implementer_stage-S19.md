# S19 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s19-visit-date-search.test.tsx`
- 결과: failed: true
- 요약: 방문일 기간 검색 UI·필터 부재. 구현 전.

## 구현
- 시작일·종료일 + 검색. visitAt 날짜 기준 필터.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s19-visit-date-search.test.tsx`
- 결과: passed
