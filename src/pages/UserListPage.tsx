import { useEffect, useCallback } from 'react';
import { Layout } from '@common/components/Layout';
import { useRequireRole } from '@common/hooks/useAuth';
import { useApi } from '@common/hooks/useApi';
import { Role } from '@common/types/constants';
import { theme } from '@common/styles/theme';
import type { VUser } from '@common/types/auth';
import { adminNavItems } from '../navigation';
import { getUsers, approveUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

interface UserListPageProps {
  onSelectUser: (user: VUser) => void;
}

export function UserListPage({ onSelectUser }: UserListPageProps) {
  useRequireRole(Role.LEAD, Role.ADMIN);

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, execute } = useApi(fetcher);
  const visibleUsers = users?.filter((user) => user.status_name !== '승인대기') ?? [];

  useEffect(() => {
    execute();
  }, [execute]);

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <Layout title="회원 관리" sideNavItems={adminNavItems}>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '24px',
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
        }}
      >
        <h2 style={{ marginTop: 0 }}>회원 목록</h2>
        {loading && <p>로딩 중...</p>}
        {users && (
          <UserTable users={visibleUsers} onSelect={onSelectUser} onApprove={handleApprove} />
        )}
      </div>
    </Layout>
  );
}
