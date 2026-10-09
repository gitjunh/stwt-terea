# S28 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s28-mobile-main.test.tsx`
- 결과: failed: true
- 요약: data-viewport=mobile·모바일 레이아웃 부재. 구현 전.

## 구현
- `useMobileLayout`로 좁은 뷰포트 시 data-viewport=mobile.
- 모바일 CSS(CTA 세로·패딩). 방문신청 진입 확인.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s28-mobile-main.test.tsx`
- 결과: passed
