# S29 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s29-mobile-apply.test.tsx`
- 결과: failed: true
- 요약: 모바일 완료 안내 문구 부재. 구현 전.

## 구현
- 모바일 뷰포트에서 동의→서약→입력→제출 플로우 + 완료 안내.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s29-mobile-apply.test.tsx`
- 결과: passed
