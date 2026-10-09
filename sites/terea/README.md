# terea 방문·관리

Vite + React + TypeScript. 데이터는 브라우저 `localStorage`에 저장합니다. 원본 운영 사이트 계정은 사용하지 않습니다.

## GitHub Pages (웹에서 바로 사용)

저장소: https://github.com/gitjunh/stwt-terea  
배포 URL: **https://gitjunh.github.io/stwt-terea/**

### 한 번만 설정

1. GitHub → **Settings** → **Pages**
2. Build and deployment → Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / folder: **`/` (root)** → Save

이후 `main` 푸시마다 Actions가 `gh-pages`를 갱신합니다. (이미 `gh-pages` 브랜치에 빌드본이 올라가 있음)

- 프론트만 호스팅됩니다. 관리·방문 데이터는 브라우저 `localStorage`로 동작합니다.
- 저장소가 **Private**이면 Pages 사용에 GitHub 유료 플랜이 필요할 수 있습니다. 공개(Public)로 두면 무료로 열립니다.

## 로컬 실행

```bash
npm install
npm run dev
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 |
| `npm run build:pages` | GitHub Pages용 빌드 (`/stwt-terea/` base) |
| `npm test` | Vitest (jsdom) |

## 로컬 관리 테스트 계정

시드: `src/auth/adminAccounts.ts` (`LOCAL_ADMIN_SEED`)

| 항목 | 값 |
| --- | --- |
| ID | `terea-admin` |
| PW | `terea-admin-local-01` |

관리 로그인: `/manager/login`

## 로컬 방문 테스트 계정

시드: `src/auth/visitorAccounts.ts` (`LOCAL_VISITOR_SEED`). 원본 운영 계정 아님.

| 항목 | 값 |
| --- | --- |
| 성명 | `terea방문테스터` |
| 휴대전화 | `01022223333` |

방문 신청·조회(`/lookup`) 테스트에 사용. 시드 신청이 로컬 스토리지에 포함됩니다.

## 관리자 사이트맵

| 그룹 | 메뉴 | 경로 |
| --- | --- | --- |
| 시스템관리 | 사용자 관리 | `/manager/users` |
| 시스템관리 | 권한그룹 관리 | `/manager/permission-groups` |
| 시스템관리 | 부서 관리 | `/manager/departments` |
| 시스템관리 | 기초코드 관리 | `/manager/codes` |
| 방문자 관리 | 방문 승인 | `/manager/approvals` |
| 방문자 관리 | 차량 승인 | `/manager/vehicles` |
| 방문자 관리 | 방문자 현황 | `/manager/visitors` |
| 방문카드 관리 | 방문카드 발급/반납 | `/manager/visit-cards` |
| 방문카드 관리 | 방문카드 발급/반납 조회 | `/manager/visit-cards/history` |
| 방문카드 관리 | 방문자 출입이력 | `/manager/access-logs` |
