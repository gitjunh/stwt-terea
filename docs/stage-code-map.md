# 단계별 구현 대응

경로 기준: `sites/terea/`. QA는 `_workspace/07_qa-inspector_stage-<id>.md` / 최적화 `_workspace/09_qa-inspector_hardening.md`.

| 단계 | 증명할 동작 | 테스트 | 구현 파일 | 커밋 | QA |
| --- | --- | --- | --- | --- | --- |
| S1 | `sites/terea/` 로컬 앱 골격 | `npm test -- tests/s1-skeleton.test.ts` | `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, `vitest.config.ts`, `package.json` 등 | `82ae1ed` | passed |
| S2 | 브랜드·문서 표기 terea(kemco 잔존 금지) | `npm test -- tests/s2-branding.test.tsx` | `index.html`, `src/App.tsx` | `6ecdb6c` | passed |
| S3 | 환영·방문신청·신청 조회 | `npm test -- tests/s3-visit-main.test.tsx` | `src/pages/VisitMain.tsx`, `src/App.tsx`, `src/index.css` | `33e8713` | passed |
| S4 | 출입절차 STEP 1–4 | `npm test -- tests/s4-entry-steps.test.tsx` | `src/pages/VisitMain.tsx`, `src/index.css` | `d3f9935` | passed |
| S5 | Dark Mode 전환 | `npm test -- tests/s5-dark-mode.test.tsx` | `src/hooks/useDarkMode.ts`, `src/pages/VisitMain.tsx`, `src/index.css` | `9c25ea1` | passed |
| S6 | 신청 조회 화면 진입 | `npm test -- tests/s6-lookup-entry.test.tsx` | `src/pages/ApplicationLookup.tsx`, `src/App.tsx` | `1168388` | passed |
| S7 | 식별 정보로 신청 상태 조회 | `npm test -- tests/s7-lookup-result.test.tsx` | `src/pages/ApplicationLookup.tsx`, `src/store/applications.ts`, `src/index.css` | `b66a2e0` | passed |
| S8 | 개인정보 동의 화면·필수 항목 | `npm test -- tests/s8-privacy-consent.test.tsx` | `src/pages/PrivacyConsent.tsx`, `src/components/WizardStepper.tsx`, `src/App.tsx`, `src/index.css` | `7a062d8` | passed |
| S9 | 필수 동의 후에만 다음 단계 | `npm test -- tests/s9-privacy-gate.test.tsx` | `src/pages/PrivacyConsent.tsx`, `src/pages/SafetyPledge.tsx`, `src/App.tsx` | `f9748e7` | passed |
| S10 | 안전서약서 확인·동의 UI | `npm test -- tests/s10-safety-pledge.test.tsx` | `src/pages/SafetyPledge.tsx`, `src/index.css` | `cebfdb6` | passed |
| S11 | 서약 동의 후 방문정보 이동 | `npm test -- tests/s11-safety-gate.test.tsx` | `src/pages/SafetyPledge.tsx`, `src/pages/VisitInfo.tsx`, `src/App.tsx` | `5c93e20` | passed |
| S12 | 방문정보 필수 필드 | `npm test -- tests/s12-visit-fields.test.tsx` | `src/pages/VisitInfo.tsx`, `src/index.css` | `92d9c42` | passed |
| S13 | 차량번호 입력 | `npm test -- tests/s13-vehicle.test.tsx` | `src/pages/VisitInfo.tsx` | `5cd0c2c` | passed |
| S14 | 얼굴 사진 등록 | `npm test -- tests/s14-face-photo.test.tsx` | `src/pages/VisitInfo.tsx` | `24f8099` | passed |
| S15 | 방문신청 제출·완료 안내 | `npm test -- tests/s15-submit.test.tsx` | `src/pages/VisitInfo.tsx`, `src/pages/ApplicationComplete.tsx`, `src/store/applications.ts`, `src/App.tsx` | `8615c15` | passed |
| S16 | 관리 로그인 ID·PW UI | `npm test -- tests/s16-admin-login-ui.test.tsx` | `src/pages/AdminLogin.tsx`, `src/App.tsx`, `src/index.css` | `f003625` | passed |
| S17 | 로컬 관리 계정 로그인 | `npm test -- tests/s17-admin-login.test.tsx` | `src/auth/adminAccounts.ts`, `src/auth/adminSession.ts`, `src/pages/AdminLogin.tsx`, `src/pages/VisitorStatus.tsx`, `src/App.tsx`, `README.md` | `d04b305` | passed |
| S18 | 방문자 현황 목록·컬럼 | `npm test -- tests/s18-visitor-list.test.tsx` | `src/pages/VisitorStatus.tsx`, `src/index.css` | `8eab942` | passed |
| S19 | 방문일 기간 검색 | `npm test -- tests/s19-visit-date-search.test.tsx` | `src/pages/VisitorStatus.tsx`, `src/index.css` | `2613cf8` | passed |
| S20 | 방문신청 링크 보내기(로컬 기록) | `npm test -- tests/s20-send-link.test.tsx` | `src/pages/VisitorStatus.tsx`, `src/store/linkSends.ts`, `src/index.css` | `77d8e10` | passed |
| S21 | 방문 승인 목록 | `npm test -- tests/s21-visit-approval-list.test.tsx` | `src/pages/VisitApproval.tsx`, `src/components/AdminNav.tsx`, `src/pages/VisitorStatus.tsx`, `src/App.tsx` | `77cfc7a` | passed |
| S22 | 방문 승인 처리 | `npm test -- tests/s22-visit-approve.test.tsx` | `src/pages/VisitApproval.tsx`, `src/store/applications.ts` | `cea9387` | passed |
| S23 | 방문 반려 처리 | `npm test -- tests/s23-visit-reject.test.tsx` | `src/pages/VisitApproval.tsx` | `a9e8d08` | passed |
| S24 | 차량 승인 처리 | `npm test -- tests/s24-vehicle-approve.test.tsx` | `src/pages/VehicleApproval.tsx`, `src/components/AdminNav.tsx`, `src/store/applications.ts`, `src/App.tsx` | `dc7f6b4` | passed |
| S25 | 승인 후 QR 안내(로컬) | `npm test -- tests/s25-qr-notice.test.tsx` | `src/store/qrNotices.ts`, `src/pages/VisitApproval.tsx`, `src/pages/ApplicationLookup.tsx`, `src/index.css` | `219bb6a` | passed |
| S26 | 엑셀출력 | `npm test -- tests/s26-excel-export.test.tsx` | `src/lib/excelExport.ts`, `src/pages/VisitorStatus.tsx` | `3966cf7` | passed |
| S27 | 로컬 방문 테스트 계정 | `npm test -- tests/s27-visitor-account.test.tsx` | `src/auth/visitorAccounts.ts`, `src/store/applications.ts`, `README.md` | `6ee1360` | passed |
| S28 | 모바일 방문 메인 진입 | `npm test -- tests/s28-mobile-main.test.tsx` | `src/hooks/useMobileLayout.ts`, `src/App.tsx`, `src/index.css`, `tests/mobile-test-utils.ts` | `a34e763` | passed |
| S29 | 모바일 방문신청 완료 | `npm test -- tests/s29-mobile-apply.test.tsx` | `src/pages/ApplicationComplete.tsx` | `c0a9867` | passed |
| S30 | 모바일 신청 조회 | `npm test -- tests/s30-mobile-lookup.test.tsx` | `src/pages/ApplicationLookup.tsx` | `2f70dd4` | passed |

관련 수정 커밋(단계 외): `a85f68e` fix: matchMedia 폴백으로 전체 테스트 안정화.

## 최적화

| 항목 | 파일 | 이유 | 이후 QA |
| --- | --- | --- | --- |
| linkSends localStorage JSON 파싱 방어 | `src/store/linkSends.ts` | 손상 데이터 시 화면 크래시 방지 | `_workspace/09_qa-inspector_hardening.md` passed |
| referrer meta `strict-origin-when-cross-origin` | `index.html` | 교차 출처 referrer 제한 | 동일 |
| (유지) 외부 CDN·원격 fetch·운영 토큰 없음 | — | 성능·보안 유지 | 동일 |

최적화 커밋: `f675c1a` hardening: referrer meta·linkSends 파싱 방어.
전체 회귀: `cd sites/terea && npm test` → Test Files 30 passed / Tests 31 passed.
