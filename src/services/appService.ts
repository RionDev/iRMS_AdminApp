import apiClient from "@common/services/apiClient";
import type { Page } from "@common/types/pagination";
import type { AdminApp, UpdateAppRequest } from "../types/app";

export interface AppStatistics {
  total: number;
  active: number;
  blocked: number;
}

export async function getApps(
  cursor?: string,
  snapshotIdx?: number,
  size: number = 50,
): Promise<Page<AdminApp>> {
  const res = await apiClient.get<Page<AdminApp>>("/api/app/apps", {
    params: { cursor, snapshot_idx: snapshotIdx, size },
  });
  return res.data;
}

export async function getAppStatistics(): Promise<AppStatistics> {
  const res = await apiClient.get<AppStatistics>("/api/app/statistics");
  return res.data;
}

export async function updateApp(
  idx: number,
  data: UpdateAppRequest,
): Promise<void> {
  await apiClient.put(`/api/app/apps/${idx}`, data);
}
