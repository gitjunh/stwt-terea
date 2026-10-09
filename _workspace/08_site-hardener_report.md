# 최적화

## 성능
- 유지: 첫 화면·단계 경로에 대용량 이미지·외부 CDN·중복 fetch 없음. 얼굴 사진은 파일명만 저장해 바이너리 업로드 부담 없음.
- 유지: 폰트는 로컬 스택(`Pretendard`/`Noto Sans KR` 선언)만 사용. CDN 로드는 외부 의존·보안 위험을 키워 추가하지 않음.
- 유지: 엑셀 출력은 `createObjectURL` 후 즉시 `revokeObjectURL` (기존).

## 안전성
- 변경: `sites/terea/src/store/linkSends.ts` — localStorage JSON 파싱을 try/catch로 감싸 손상 데이터 시 화면 크래시 방지 (`applications`/`qrNotices`와 동일 패턴).
- 유지: 신청 조회 무결과 안내, 관리 미로그인 시 `/manager/login` 리다이렉트, 라우트·Link 대상 존재.

## 보안
- 변경: `sites/terea/index.html` — `referrer` meta `strict-origin-when-cross-origin` 추가.
- 유지: 외부 스크립트·원본 운영 계정/토큰 없음. 관리·방문 시드는 로컬 전용(`terea-admin-local-01` 등)이며 README에 명시. `dangerouslySetInnerHTML`/원격 fetch 없음. CSV는 escape 처리.

## 다시 실행한 테스트
- 명령: `cd sites/terea && npm test`
- 결과: Test Files 30 passed / Tests 31 passed
