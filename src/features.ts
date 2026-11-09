/**
 * 관리자 앱 기능 키 — BE user_service / app_service src/features.py 와 같은 값.
 * 관리자가 admin 앱 → 앱 상세 → 기능 권한에서 기능별 최소 등급·허용 팀을 정한다.
 * 화면은 useFeatures(ADMIN_APP).can(키) 로 메뉴·버튼을 숨기고, 실제 차단은 BE 가 한다.
 */
export const ADMIN_APP = "/admin";

export const AdminFeature = {
  USER_VIEW: "user_view",
  USER_APPROVE: "user_approve",
  USER_MANAGE: "user_manage",
  APP_MANAGE: "app_manage",
} as const;
