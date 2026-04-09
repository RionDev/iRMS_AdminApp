import { useState } from 'react';
import { Layout } from '@common/components/Layout';
import { Modal } from '@common/components/Modal';
import { Input } from '@common/components/Input';
import { Button } from '@common/components/Button';
import { useRequireRole } from '@common/hooks/useAuth';
import { Role } from '@common/types/constants';
import { theme } from '@common/styles/theme';
import type { VUser } from '@common/types/auth';
import { adminNavItems } from '../navigation';
import { updateUser, deleteUser, resetPassword } from '../services/userService';
import type { UpdateUserRequest } from '../types/user';
import { UserForm } from '../components/UserForm';

interface UserDetailPageProps {
  user: VUser;
  onBack: () => void;
}

export function UserDetailPage({ user, onBack }: UserDetailPageProps) {
  const currentUser = useRequireRole(Role.LEAD, Role.ADMIN);
  const [message, setMessage] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (idx: number, data: UpdateUserRequest) => {
    setMessage(null);
    try {
      await updateUser(idx, data);
      setMessage('수정되었습니다.');
    } catch {
      // interceptor가 alert 처리
    }
  };

  const handleDelete = async (idx: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteUser(idx);
      onBack();
    } catch {
      // interceptor가 alert 처리
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword({ user_idx: user.idx, new_password: newPassword });
      setResetModalOpen(false);
      setNewPassword('');
      setMessage('비밀번호가 초기화되었습니다.');
    } catch {
      // interceptor가 alert 처리
    }
  };

  return (
    <Layout title="회원 상세" sideNavItems={adminNavItems}>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: '24px',
          borderRadius: theme.radius.md,
          maxWidth: '480px',
          boxShadow: theme.shadow.card,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ marginTop: 0 }}>회원 상세</h2>
          <Button variant="secondary" onClick={onBack}>
            목록으로
          </Button>
        </div>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={onBack}
        />
        {currentUser && currentUser.role === Role.ADMIN && (
          <Button
            variant="secondary"
            onClick={() => setResetModalOpen(true)}
            style={{ marginTop: '12px', width: '100%' }}
          >
            비밀번호 초기화
          </Button>
        )}
        {message && <p style={{ color: theme.colors.success, marginTop: '12px' }}>{message}</p>}
      </div>

      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="비밀번호 초기화"
      >
        <Input
          label="새 비밀번호"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Button onClick={handleResetPassword} style={{ flex: 1 }}>
            초기화
          </Button>
          <Button variant="secondary" onClick={() => setResetModalOpen(false)} style={{ flex: 1 }}>
            취소
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
