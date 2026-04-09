import { useEffect, useCallback } from 'react';
import { Layout } from '@common/components/Layout';
import { useRequireRole } from '@common/hooks/useAuth';
import { useApi } from '@common/hooks/useApi';
import { Role } from '@common/types/constants';
import { theme } from '@common/styles/theme';
import { adminNavItems } from '../navigation';
import { getUsers, approveUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

export function ApprovalPage() {
  useRequireRole(Role.LEAD, Role.ADMIN);

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, execute } = useApi(fetcher);

  useEffect(() => {
    execute();
  }, [execute]);

  const pendingUsers = users?.filter((u) => u.status_name === '승인대기') ?? [];

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <Layout title="가입 승인" sideNavItems={adminNavItems}>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '24px',
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
        }}
      >
        <h2 style={{ marginTop: 0 }}>가입 승인 대기</h2>
        {loading && <p>로딩 중...</p>}
        {pendingUsers.length === 0 && !loading && (
          <p style={{ color: theme.colors.textMuted }}>승인 대기 중인 사용자가 없습니다.</p>
        )}
        {pendingUsers.length > 0 && (
          <UserTable users={pendingUsers} onSelect={() => {}} onApprove={handleApprove} />
        )}
      </div>
    </Layout>
  );
}
