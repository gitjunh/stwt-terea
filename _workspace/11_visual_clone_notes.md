# 원본 동일화 갱신 (R12/R13 visual-clone)

- 근거: 첨부 스크린샷 6장 + 원본 URL 소수 확인(봇 주의, 연속 요청 없음)
- 브랜드: 켐코(주)/블루시티/KEMCO → `terea(주)` / `terea`

## 원본 사이트맵 (방문)

| 원본 URL | 로컬 경로 | 화면 |
| --- | --- | --- |
| `/Visitor/kr/Main` | `/` | 방문 메인 (terea(주), 환영, 2카드, STEP1–4, Dark Mode) |
| `/Visitor/kr/VisitReservation.aspx` | `/apply/*` 4단 | 방문신청 위저드 |
| `#dvStep1` | `/apply/privacy` | 개인정보동의 |
| `#dvStep2` | `/apply/safety` | 안전서약서 |
| `#dvStep3` | `/apply/visit-info` | 방문 정보 |
| `#dvStep4` | `/apply/visitor-info` | 방문자 정보 |
| `/Visitor/kr/VisitReservationSearch.aspx` | `/lookup` | 신청 조회 |
| (완료/동영상 모달) | `/apply/complete` | 신청 완료 (동영상은 로컬 안내로 대체 가능) |

## 원본 사이트맵 (관리)

| 원본 URL | 로컬 경로 |
| --- | --- |
| `/Manager/View/Login` | `/manager/login` |
| 방문 승인 | `/manager/approvals` |
| 차량 승인 | `/manager/vehicles` |
| 방문자 현황 | `/manager/visitors` |

## 채운 콘텐츠

- 동의: 수집표 3행, 제3자 예외 2줄, 라디오·모두동의·하단 버튼
- 서약: 전문 + 조항 1–14 (원본 문구)
- 방문 정보: 장소 10·목적 4·유형 4·기간·찾아갈 분 모달
- 방문자 정보: 사진, 소속 회사, 직급, 외국인, 성명, 휴대전화, 이메일, 차량번호
