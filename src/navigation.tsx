import type { SidebarItem } from "@common/components/AppLayout";
import { useAuthStore } from "@common/stores/authStore";
import { Role } from "@common/types/constants";
import { useMemo } from "react";

const userIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const approvalIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const blockedIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const appIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const allowIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const accountGroup: SidebarItem = {
  label: "계정 관리",
  icon: userIcon,
  children: [
    { label: "계정 목록", to: "/users", icon: userIcon },
    { label: "가입 승인", to: "/approval", icon: approvalIcon },
    { label: "차단 계정", to: "/blocked", icon: blockedIcon },
  ],
};

const appGroup: SidebarItem = {
  label: "앱 관리",
  icon: appIcon,
  children: [
    { label: "앱 허용", to: "/apps", icon: allowIcon },
    { label: "앱 차단", to: "/apps-blocked", icon: blockedIcon },
  ],
};

/**
 * 현재 로그인 유저 기준 admin 사이드바 메뉴.
 * 앱 관리 그룹은 app_service 가 Admin 전용이므로 Admin 에게만 노출한다.
 */
export function useAdminNavItems(): SidebarItem[] {
  const user = useAuthStore((s) => s.user);
  return useMemo(() => {
    const items: SidebarItem[] = [accountGroup];
    if (user?.role === Role.ADMIN) {
      items.push(appGroup);
    }
    return items;
  }, [user?.role]);
}
