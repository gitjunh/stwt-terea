# S26 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s26-excel-export.test.tsx`
- 결과: failed: true
- 요약: 엑셀출력 버튼·다운로드 부재. 구현 전.

## 구현
- 방문자 현황 「엑셀출력」→ CSV(.xls) Blob 다운로드.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s26-excel-export.test.tsx`
- 결과: passed
