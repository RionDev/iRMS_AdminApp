import apiClient from '@common/services/apiClient';
import type { Page } from '@common/types/pagination';
import type { VUser } from '@common/types/auth';
import type {
  RegisterRequest,
  ApproveRequest,
  UpdateUserRequest,
} from '../types/user';

export async function register(data: RegisterRequest): Promise<void> {
  await apiClient.post('/api/user/register', data);
}

export async function approveUser(data: ApproveRequest): Promise<void> {
  await apiClient.post('/api/user/approve', data);
}

export interface GetUsersQuery {
  /** 필터링할 상태 (PENDING/ACTIVE/INACTIVE). 여러 값 지정 가능. */
  status?: string[];
  /** 팀 필터 (ENGINE/ANALYST). Admin만 사용 가능, Lead는 서버에서 본인 팀으로 고정. */
  team?: string;
  /** 역할 필터 (ADMIN/LEAD/MEMBER/GUEST). */
  role?: string;
  /** 이름 부분일치 검색. */
  name?: string;
  /** 아이디 부분일치 검색. */
  id?: string;
}

export async function getUsers(
  query: GetUsersQuery = {},
  cursor?: string,
  snapshotIdx?: number,
  size: number = 50,
): Promise<Page<VUser>> {
  const res = await apiClient.get<Page<VUser>>('/api/user/users', {
    params: {
      cursor,
      snapshot_idx: snapshotIdx,
      size,
      status: query.status,
      team: query.team,
      role: query.role,
      name: query.name,
      id: query.id,
    },
    // 배열 파라미터를 ?status=A&status=B 형태로 직렬화
    paramsSerializer: { indexes: null },
  });
  return res.data;
}

export async function updateUser(idx: number, data: UpdateUserRequest): Promise<void> {
  await apiClient.put(`/api/user/users/${idx}`, data);
}

export async function deleteUser(idx: number): Promise<void> {
  await apiClient.delete(`/api/user/users/${idx}`);
}

export interface UserStatistics {
  total: number;
  pending: number;
  active: number;
  inactive: number;
}

export async function getUserStatistics(): Promise<UserStatistics> {
  const res = await apiClient.get<UserStatistics>('/api/user/statistics');
  return res.data;
}
