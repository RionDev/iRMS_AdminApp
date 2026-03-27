import apiClient from '@common/services/apiClient';
import type { VUser } from '@common/types/auth';
import type {
  RegisterRequest,
  ApproveRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
} from '../types/user';

export async function register(data: RegisterRequest): Promise<void> {
  await apiClient.post('/api/user/register', data);
}

export async function approveUser(data: ApproveRequest): Promise<void> {
  await apiClient.post('/api/user/approve', data);
}

export async function getUsers(): Promise<VUser[]> {
  const res = await apiClient.get<{ users?: BackendUser[] } | BackendUser[]>('/api/user/users');
  const users = Array.isArray(res.data) ? res.data : res.data.users ?? [];
  return users.map(mapUser);
}

export async function updateUser(idx: number, data: UpdateUserRequest): Promise<void> {
  await apiClient.put(`/api/user/users/${idx}`, data);
}

export async function deleteUser(idx: number): Promise<void> {
  await apiClient.delete(`/api/user/users/${idx}`);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/api/user/reset-password', data);
}

interface BackendUser {
  idx: number;
  id: string;
  name: string;
  team?: number | string | null;
  role?: number | string;
  status?: number | string;
  team_name?: string | null;
  role_name?: string | null;
  status_name?: string | null;
  last_at?: string | null;
}

function mapUser(user: BackendUser): VUser {
  return {
    idx: user.idx,
    id: user.id,
    name: user.name,
    team: typeof user.team === 'number' ? user.team : null,
    role: typeof user.role === 'number' ? user.role : undefined,
    status: user.status,
    team_name: user.team_name ?? formatTeamName(user.team),
    role_name: user.role_name ?? formatRoleName(user.role),
    status_name: user.status_name ?? formatStatusName(user.status),
    last_at: user.last_at ?? null,
  };
}

function formatTeamName(team: BackendUser['team']): string {
  if (typeof team === 'string') return team;
  if (team === 1) return '엔진';
  if (team === 2) return '분석';
  return '-';
}

function formatRoleName(role: BackendUser['role']): string {
  if (typeof role === 'string') return role;
  if (role === 1) return 'Member';
  if (role === 2) return 'Lead';
  if (role === 3) return 'Admin';
  if (role === 4) return 'Guest';
  return '-';
}

function formatStatusName(status: BackendUser['status']): string {
  if (typeof status === 'string') return status;
  if (status === 1) return '활성';
  if (status === 0) return '대기';
  return '-';
}
