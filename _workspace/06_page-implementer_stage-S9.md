# S9 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s9-privacy-gate.test.tsx`
- 결과: failed: true
- 요약: 동의 게이트·다음 이동 부재. 구현 전.

## 구현
- 필수 3항 모두 체크 시에만「동의하고 다음」활성, `/apply/safety`로 이동.
- SafetyPledge는 S9 이동용 최소 골격(확인·동의 UI는 S10).

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s9-privacy-gate.test.tsx`
- 결과: passed
