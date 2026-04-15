import { useEffect, useCallback } from 'react';
import { AppLayout } from '@common/components/AppLayout';
import { useAppAccess } from '@common/hooks/useAuth';
import { useApi } from '@common/hooks/useApi';
import { useThemeStore } from '@common/stores/themeStore';
import { adminNavItems } from '../navigation';
import { getUsers, approveUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

export function ApprovalPage() {
  useAppAccess('/admin');
  const { theme } = useThemeStore();

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, execute } = useApi(fetcher);

  useEffect(() => {
    execute();
  }, [execute]);

  const pendingUsers = users?.filter((u) => u.status_name === 'PENDING') ?? [];

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <AppLayout title="가입 승인" appName="ADMIN" sidebarItems={adminNavItems} version={__APP_VERSION__}>
      <h2 style={{ marginTop: 0, marginBottom: '16px' }}>가입 승인 대기</h2>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '24px',
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
        }}
      >
        {loading && <p>로딩 중...</p>}
        {pendingUsers.length === 0 && !loading && (
          <p style={{ color: theme.colors.textMuted }}>승인 대기 중인 사용자가 없습니다.</p>
        )}
        {pendingUsers.length > 0 && (
          <UserTable users={pendingUsers} onSelect={() => {}} onApprove={handleApprove} />
        )}
      </div>
    </AppLayout>
  );
}
