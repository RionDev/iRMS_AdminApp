import { useEffect, useCallback } from 'react';
import { Layout } from '@common/components/Layout';
import { useAuth, useRequireRole } from '@common/hooks/useAuth';
import { useApi } from '@common/hooks/useApi';
import { Role } from '@common/types/constants';
import type { VUser } from '@common/types/auth';
import { getUsers, approveUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

interface UserListPageProps {
  onSelectUser: (user: VUser) => void;
}

export function UserListPage({ onSelectUser }: UserListPageProps) {
  useRequireRole(Role.LEAD, Role.ADMIN);

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, error, execute } = useApi(fetcher);

  useEffect(() => {
    execute();
  }, [execute]);

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <Layout title="회원 관리">
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>회원 목록</h2>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: '#d32f2f' }}>{error}</p>}
        {users && (
          <UserTable users={users} onSelect={onSelectUser} onApprove={handleApprove} />
        )}
      </div>
    </Layout>
  );
}
