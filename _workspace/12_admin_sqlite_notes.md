# R14 관리자 전수 클론 · SQLite 요약

## 관리자 사이트맵

| 그룹 | 메뉴 | 라우트 |
| --- | --- | --- |
| 시스템관리 | 사용자 관리 | `/manager/users` |
| 시스템관리 | 권한그룹 관리 | `/manager/permission-groups` |
| 시스템관리 | 부서 관리 | `/manager/departments` |
| 시스템관리 | 기초코드 관리 | `/manager/codes` |
| 방문자 관리 | 방문 승인 | `/manager/approvals` |
| 방문자 관리 | 차량 승인 | `/manager/vehicles` |
| 방문자 관리 | 방문자 현황 | `/manager/visitors` |
| 방문카드 관리 | 방문카드 발급/반납 | `/manager/visit-cards` |
| 방문카드 관리 | 발급/반납 조회 | `/manager/visit-cards/history` |
| 방문카드 관리 | 방문자 출입이력 | `/manager/access-logs` |
| (인증) | 관리 로그인 | `/manager/login` |

브랜드 UI: KEM CO → **terea**. AdminShell(다크 네이비 사이드바 + 밝은 본문 + 탭바).

## SQLite 테이블

| 테이블 | 용도 |
| --- | --- |
| `users` | 관리 사용자 |
| `permission_groups` | 권한그룹(1001~1004) |
| `permissions` | 그룹×메뉴×권한 여부 |
| `departments` | 부서 |
| `codes` | 기초코드 |
| `applications` | 방문 신청 |
| `vehicles` | 차량(신청 연동) |
| `visit_cards` | 방문카드 발급/반납 |
| `access_logs` | 출입 이력 |
| `link_sends` | 방문신청 링크 전송 기록 |
| `qr_notices` | 승인 QR 안내 |

경로: `sites/terea/server/data/terea.sqlite`

시드: `terea-admin` / `terea-admin-local-01`, 그룹 1001~1004, 방문 테스터 신청 1건 포함.
