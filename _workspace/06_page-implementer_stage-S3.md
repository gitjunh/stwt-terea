# S3 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s3-visit-main.test.tsx`
- 결과: failed: true
- 요약: 환영 문구·방문신청·신청 조회 링크 부재. 구현 전.

## 구현
- `VisitMain`에 「방문을 환영합니다.」, Link「방문신청」「신청 조회」추가.
- App에 `/` 라우트 연결.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s3-visit-main.test.tsx`
- 결과: passed
