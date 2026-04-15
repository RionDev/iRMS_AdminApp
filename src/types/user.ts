import type { RoleType } from '@common/types/constants';

export interface RegisterRequest {
  id: string;
  password: string;
  name: string;
  role: RoleType;
  team: number | null;
}

export interface ApproveRequest {
  user_idx: number;
}

export interface UpdateUserRequest {
  name?: string;
  team?: number;
  role?: RoleType;
  status?: number;
}

export interface ResetPasswordRequest {
  user_idx: number;
  new_password: string;
}
