import { useEffect, useCallback } from 'react';
import { AppLayout } from '@common/components/AppLayout';
import { useAppAccess } from '@common/hooks/useAuth';
import { useApi } from '@common/hooks/useApi';
import { useThemeStore } from '@common/stores/themeStore';
import type { VUser } from '@common/types/auth';
import { adminNavItems } from '../navigation';
import { getUsers, approveUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

interface UserListPageProps {
  onSelectUser: (user: VUser) => void;
}

export function UserListPage({ onSelectUser }: UserListPageProps) {
  useAppAccess('/admin');
  const { theme } = useThemeStore();

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, execute } = useApi(fetcher);
  const visibleUsers = users?.filter((user) => user.status_name !== 'PENDING') ?? [];

  useEffect(() => {
    execute();
  }, [execute]);

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <AppLayout title="회원 목록" appName="ADMIN" sidebarItems={adminNavItems} version={__APP_VERSION__}>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '24px',
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
        }}
      >
        {loading && <p>로딩 중...</p>}
        {users && (
          <UserTable users={visibleUsers} onSelect={onSelectUser} onApprove={handleApprove} />
        )}
      </div>
    </AppLayout>
  );
}
