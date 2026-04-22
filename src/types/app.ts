import type { TeamType } from "@common/types/constants";

/** 관리자용 앱 정보 (BE AdminAppResponse 대응) */
export interface AdminApp {
  idx: number;
  path: string;
  name: string;
  /** 최소 허용 등급 idx (1:ADMIN, 2:LEAD, 3:MEMBER). null=전체 */
  min_role: number | null;
  /** 허용 팀 (대문자 name 문자열). null=전체 */
  team: TeamType | null;
  /** 1:활성(허용), 0:비활성(차단) */
  is_active: number;
}

/** 앱 수정 요청 (부분 업데이트) */
export interface UpdateAppRequest {
  name?: string;
  min_role?: number | null;
  team?: TeamType | null;
  is_active?: number;
}
