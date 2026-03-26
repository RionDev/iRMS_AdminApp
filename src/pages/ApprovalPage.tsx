import { useEffect, useCallback } from 'react';
import { Layout } from '@common/components/Layout';
import { useRequireRole } from '@common/hooks/useAuth';
import { useApi } from '@common/hooks/useApi';
import { Role } from '@common/types/constants';
import { getUsers, approveUser } from '../services/userService';
import { UserTable } from '../components/UserTable';

export function ApprovalPage() {
  useRequireRole(Role.LEAD, Role.ADMIN);

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, error, execute } = useApi(fetcher);

  useEffect(() => {
    execute();
  }, [execute]);

  const pendingUsers = users?.filter((u) => u.status_name === '대기') ?? [];

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <Layout title="가입 승인">
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>가입 승인 대기</h2>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: '#d32f2f' }}>{error}</p>}
        {pendingUsers.length === 0 && !loading && (
          <p style={{ color: '#666' }}>승인 대기 중인 사용자가 없습니다.</p>
        )}
        {pendingUsers.length > 0 && (
          <UserTable users={pendingUsers} onSelect={() => {}} onApprove={handleApprove} />
        )}
      </div>
    </Layout>
  );
}
