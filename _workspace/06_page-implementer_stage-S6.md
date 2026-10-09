# S6 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s6-lookup-entry.test.tsx`
- 결과: failed: true
- 요약: /lookup 라우트·조회 화면 부재. 구현 전.

## 구현
- ApplicationLookup 화면과 `/lookup` 라우트. 메인「신청 조회」링크로 진입.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s6-lookup-entry.test.tsx`
- 결과: passed
