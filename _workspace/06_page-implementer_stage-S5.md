# S5 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s5-dark-mode.test.tsx`
- 결과: failed: true
- 요약: Dark Mode 버튼 부재. 구현 전.

## 구현
- VisitMain 상단 Dark Mode 토글, `data-theme` 전환, localStorage 유지.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s5-dark-mode.test.tsx`
- 결과: passed
