import type { SidebarItem } from "@common/components/AppLayout";
import { useFeatures } from "@common/hooks/useFeatures";
import { useMemo } from "react";
import { AdminFeature, ADMIN_APP } from "./features";

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

/**
 * 현재 로그인 유저 기준 admin 사이드바 메뉴.
 * 메뉴마다 BE 기능 권한(admin 앱 → 앱 상세 → 기능 권한)을 따른다. 쓸 수 없는 메뉴는 숨긴다.
 */
export function useAdminNavItems(): SidebarItem[] {
  const { can } = useFeatures(ADMIN_APP);
  return useMemo(() => {
    const items: SidebarItem[] = [];

    const accountChildren = [
      can(AdminFeature.USER_VIEW) && { label: "계정 목록", to: "/users", icon: userIcon },
      can(AdminFeature.USER_APPROVE) && { label: "가입 승인", to: "/approval", icon: approvalIcon },
      can(AdminFeature.USER_VIEW) && { label: "차단 계정", to: "/blocked", icon: blockedIcon },
    ].filter((c): c is { label: string; to: string; icon: JSX.Element } => Boolean(c));
    if (accountChildren.length > 0) {
      items.push({ label: "계정 관리", icon: userIcon, children: accountChildren });
    }

    if (can(AdminFeature.APP_MANAGE)) {
      items.push({
        label: "앱 관리",
        icon: appIcon,
        children: [
          { label: "앱 허용", to: "/apps", icon: allowIcon },
          { label: "앱 차단", to: "/apps-blocked", icon: blockedIcon },
        ],
      });
    }
    return items;
  }, [can]);
}
