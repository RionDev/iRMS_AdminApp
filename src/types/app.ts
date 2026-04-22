import type { TeamType } from "@common/types/constants";

/** "팀 제한 없음" sentinel. BE/FE 합의 — DB NULL 대신 API 레이어에서 이 문자열을 주고받는다. */
export const TEAM_FULL = "FULL" as const;

/** 앱 권한 필드에서 쓰는 팀 값: 실제 팀명 또는 FULL sentinel */
export type AppTeam = TeamType | typeof TEAM_FULL;

/** 관리자용 앱 정보 (BE AdminAppResponse 대응) */
export interface AdminApp {
  idx: number;
  path: string;
  name: string;
  /** 최소 허용 등급 idx (1:ADMIN, 2:LEAD, 3:MEMBER, 4:GUEST=전체) */
  min_role: number;
  /** 허용 팀 (ENGINE, ANALYST, FULL=전체) */
  team: AppTeam;
  /** 1:활성(허용), 0:비활성(차단) */
  is_active: number;
}

/** 앱 수정 요청 (부분 업데이트; 생략 시 변경 없음) */
export interface UpdateAppRequest {
  name?: string;
  min_role?: number;
  team?: AppTeam;
  is_active?: number;
}
