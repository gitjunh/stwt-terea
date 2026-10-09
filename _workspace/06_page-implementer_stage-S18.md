# S18 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s18-visitor-list.test.tsx`
- 결과: failed: true
- 요약: 방문자 현황 테이블·컬럼·목록 부재. 구현 전.

## 구현
- VisitorStatus 테이블: 방문업체·방문자·휴대전화·방문유형·진행상태 + 시드 목록.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s18-visitor-list.test.tsx`
- 결과: passed
