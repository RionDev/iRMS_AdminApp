import type { RoleType, TeamType } from '@common/types/constants';

export interface RegisterRequest {
  id: string;
  password: string;
  name: string;
  role: RoleType;
  team: TeamType | null;
}

export interface ApproveRequest {
  user_idx: number;
}

export interface UpdateUserRequest {
  name?: string;
  team?: TeamType;
  role?: RoleType;
  /** BE는 DB idx(int)로 받는다. 값 매핑은 @common/types/constants STATUS_CODE 사용. */
  status?: number;
  /** status === INACTIVE(3) 일 때만 허용. 포맷: `관리자이름:ISO시간:사유` */
  blocked_reason?: string;
}
