import apiClient from "@common/services/apiClient";
import type { Page } from "@common/types/pagination";
import type { AdminApp, AppTeam, UpdateAppRequest } from "../types/app";

export interface CreateAppRequest {
  path: string;
  name: string;
  min_role?: number;
  team?: AppTeam;
}

export interface AppStatistics {
  total: number;
  active: number;
  blocked: number;
}

export interface GetAppsQuery {
  /** 1=활성만, 0=비활성만, 미지정=전체 */
  is_active?: number;
  /** 최소 허용 등급 idx 정확 일치 (1:ADMIN, 2:LEAD, 3:MEMBER) */
  min_role?: number;
  /** 허용 팀 (ENGINE, ANALYST) */
  team?: string;
  /** 이름 부분일치 */
  name?: string;
  /** 경로 부분일치 */
  path?: string;
}

export async function getApps(
  query: GetAppsQuery = {},
  cursor?: string,
  snapshotIdx?: number,
  size: number = 50,
): Promise<Page<AdminApp>> {
  const res = await apiClient.get<Page<AdminApp>>("/api/app/apps", {
    params: {
      cursor,
      snapshot_idx: snapshotIdx,
      size,
      is_active: query.is_active,
      min_role: query.min_role,
      team: query.team,
      name: query.name,
      path: query.path,
    },
  });
  return res.data;
}

export async function getAppStatistics(): Promise<AppStatistics> {
  const res = await apiClient.get<AppStatistics>("/api/app/statistics");
  return res.data;
}

export async function createApp(data: CreateAppRequest): Promise<AdminApp> {
  const res = await apiClient.post<{ app: AdminApp }>("/api/app/apps", data);
  return res.data.app;
}

export async function updateApp(
  idx: number,
  data: UpdateAppRequest,
): Promise<void> {
  await apiClient.put(`/api/app/apps/${idx}`, data);
}

export async function deleteApp(idx: number): Promise<void> {
  await apiClient.delete(`/api/app/apps/${idx}`);
}
