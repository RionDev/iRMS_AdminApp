# iRMS Admin App

관리자 앱. BE user-service 대응. 회원 목록 조회, 상세 수정/삭제, 가입 승인을 담당한다.

## 책임

- 회원 목록 조회 (`GET /api/user/users`)
- 회원 상세 수정 (`PUT /api/user/users/:idx`)
- 회원 삭제 (`DELETE /api/user/users/:idx`)
- 가입 승인 (`POST /api/user/approve`)
- 회원 등록 (`POST /api/user/register`)

## 공통 규칙

- 계층 분리: pages / components / services / types
- common 모듈은 `@common/` alias로 import
- API 호출은 services 파일에서만
- 인증 상태는 `useAuth` 훅으로만 접근
- 컴포넌트는 props 기반 순수 UI

## 고유 규칙

- 모든 페이지에 `useAppAccess("/admin")` 적용 — `apps` 테이블의 `/admin` 레코드 `min_role` 기준으로 접근 제어
- BE `user-service` (포트 8005) 엔드포인트만 대응
- 독립 실행 시 Vite dev server 포트 3002 사용

## 상세 정책

| 정책           | 경로                        | 내용                      |
| -------------- | --------------------------- | ------------------------- |
| 컴포넌트       | `common/docs/components.md` | 공통 UI 컴포넌트 사용법   |
| 인증           | `common/docs/auth.md`       | 토큰 관리, 인증 훅 사용법 |
| API 클라이언트 | `common/docs/api-client.md` | Axios 인스턴스, 인터셉터  |
| 상태 관리      | `common/docs/stores.md`     | Zustand store 규칙        |

## BE API 대응

| 서비스 함수   | 엔드포인트             | 메서드 | 권한       | BE 대응                      |
| ------------- | ---------------------- | ------ | ---------- | ---------------------------- |
| `register`    | `/api/user/register`   | POST   | 공개       | `service.py → register_user` |
| `approveUser` | `/api/user/approve`    | POST   | Lead/Admin | `service.py → approve_user`  |
| `getUsers`    | `/api/user/users`      | GET    | Lead/Admin | `service.py → get_users`     |
| `updateUser`  | `/api/user/users/:idx` | PUT    | Lead/Admin | `service.py → update_user`   |
| `deleteUser`  | `/api/user/users/:idx` | DELETE | Lead/Admin | `service.py → delete_user`   |
