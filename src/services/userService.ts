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
  const res = await apiClient.get<{ users: VUser[] }>('/api/user/users');
  return res.data.users ?? [];
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
