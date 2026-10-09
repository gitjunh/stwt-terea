# terea 방문·관리 로컬 복제

Vite + React + TypeScript. 원본 운영 사이트 계정은 사용하지 않습니다.

## 실행

```bash
npm install
npm run dev
npm test
```

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
