# S8 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s8-privacy-consent.test.tsx`
- 결과: failed: true
- 요약: /apply/privacy 및 필수 동의 항목 부재. 구현 전.

## 구현
- PrivacyConsent 화면: 제목, 필수 체크 3항, 스테퍼. 진행 게이트는 S9.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s8-privacy-consent.test.tsx`
- 결과: passed
