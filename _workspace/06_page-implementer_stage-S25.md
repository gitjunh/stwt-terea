# S25 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s25-qr-notice.test.tsx`
- 결과: failed: true
- 요약: 승인 후 QR 안내 부재. 구현 전.

## 구현
- `terea-qr-notices` 로컬 기록. 승인 시 QR 패널 표시.
- 신청 조회에서도 동일 성명·전화로 QR 안내 확인(실SMS 대체).

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s25-qr-notice.test.tsx`
- 결과: passed
