# S11 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s11-safety-gate.test.tsx`
- 결과: failed: true
- 요약: 동의 후 「방문정보」 heading 없음(이동 미구현). 구현 전.

## 구현
- SafetyPledge: 동의 후 `/apply/visit-info` 이동.
- VisitInfo: 제목「방문정보 입력」골격(필수 필드는 S12).

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s11-safety-gate.test.tsx`
- 결과: passed
