export interface RegisterRequest {
  id: string;
  password: string;
  name: string;
  team: number;
}

export interface ApproveRequest {
  user_idx: number;
}

export interface UpdateUserRequest {
  name?: string;
  team?: number;
  role?: number;
  status?: number;
}

export interface ResetPasswordRequest {
  user_idx: number;
  new_password: string;
}
