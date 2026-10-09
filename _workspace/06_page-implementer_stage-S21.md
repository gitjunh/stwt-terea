# S21 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s21-visit-approval-list.test.tsx`
- 결과: failed: true
- 요약: 방문 승인 메뉴·화면 부재. 구현 전.

## 구현
- `/manager/approvals` 방문 승인 목록 + AdminNav(방문 승인·방문자 현황).
- 신청 건(성명·업체·상태 등) 표시. 승인·반려 버튼 없음(S22/S23).

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s21-visit-approval-list.test.tsx`
- 결과: passed
