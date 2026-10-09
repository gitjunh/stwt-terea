# S4 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s4-entry-steps.test.tsx`
- 결과: failed: true
- 요약: STEP 1–4 라벨 부재. 구현 전.

## 구현
- VisitMain에 출입절차 STEP 1–4(방문신청·출입승인·QRCode인식·방문증발급) 표시.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s4-entry-steps.test.tsx`
- 결과: passed
