# S30 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s30-mobile-lookup.test.tsx`
- 결과: failed: true
- 요약: 모바일 신청 조회 결과 표시 부재. 구현 전.

## 구현
- 모바일 뷰포트에서 메인→신청 조회→결과(모바일 신청 조회 결과) 확인.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s30-mobile-lookup.test.tsx`
- 결과: passed
