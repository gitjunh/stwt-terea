# S20 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s20-send-link.test.tsx`
- 결과: failed: true
- 요약: 방문신청 링크 보내기 UI·로컬 전송 기록 부재. 구현 전.

## 구현
- 링크 보내기 패널: 수신 전화번호·기본 메시지·전송.
- `terea-link-sends` localStorage 기록 + 「전송 성공」표시. 실SMS 없음.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s20-send-link.test.tsx`
- 결과: passed
