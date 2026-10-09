# S13 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s13-vehicle.test.tsx`
- 결과: failed: true
- 요약: 차량번호 입력 필드 부재. 구현 전.

## 구현
- VisitInfo에 선택 차량번호 입력 추가.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s13-vehicle.test.tsx`
- 결과: passed
