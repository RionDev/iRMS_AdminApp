# iRMS Admin App

관리자 앱 (회원 관리, 가입 승인). BE user-service 대응.

## 기술 스택

- React 18 + TypeScript
- Vite (빌드 도구)
- Zustand (상태 관리 — common에서 제공)
- Axios (HTTP 클라이언트 — common에서 제공)
- Vitest + React Testing Library (테스트)

## 연동 BE API

| 엔드포인트                 | 메서드 | 설명            | 권한       |
| -------------------------- | ------ | --------------- | ---------- |
| `/api/user/register`       | POST   | 회원 등록       | 공개       |
| `/api/user/approve`        | POST   | 가입 승인       | Lead/Admin |
| `/api/user/users`          | GET    | 회원 목록       | Lead/Admin |
| `/api/user/users/:idx`     | PUT    | 회원 수정       | Lead/Admin |
| `/api/user/users/:idx`     | DELETE | 회원 삭제       | Lead/Admin |
| `/api/user/reset-password` | POST   | 비밀번호 초기화 | Admin      |

## 라우트

| 경로              | 페이지               | 설명      |
| ----------------- | -------------------- | --------- |
| `/login`          | `LoginPage` (common) | 로그인    |
| `/admin/users`    | `UserListPage`       | 회원 목록 |
| `/admin/approval` | `ApprovalPage`       | 가입 승인 |

## 사전 준비

```bash
# submodule 초기화
git submodule update --init --recursive

# 환경 변수 설정
cp .env.example .env
```

개발 환경에서는 브라우저가 `localhost:3002`만 보도록 두고, Vite 프록시가
`/api/auth`는 인증 서버(`8001`), `/api/user`는 유저 서비스(`8005`)로 전달한다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3002
```

## 테스트

```bash
npm test           # 단일 실행
npm run test:watch # watch 모드
```

## 빌드

```bash
npm run build      # dist/ 생성
npm run preview    # 빌드 결과 미리보기
```

## Docker

```bash
docker compose up -d    # 포트 3002
docker compose down
```
