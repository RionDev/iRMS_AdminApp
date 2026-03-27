import type { SideNavItem } from '@common/components/SideNav';

export const adminNavItems: SideNavItem[] = [
  { label: '회원 목록', to: '/admin/users' },
  { label: '가입 승인', to: '/admin/approval' },
];
