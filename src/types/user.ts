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
  status?: number;
}
