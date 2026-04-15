import type { VUser } from '@common/types/auth';
import { Button } from '@common/components/Button';
import { useThemeStore } from '@common/stores/themeStore';
import { ROLE_LABEL } from '@common/types/constants';

interface UserTableProps {
  users: VUser[];
  onSelect: (user: VUser) => void;
  onApprove?: (userIdx: number) => void;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: '승인대기',
  ACTIVE: '활성',
  INACTIVE: '비활성',
};

export function UserTable({ users, onSelect, onApprove }: UserTableProps) {
  const { theme } = useThemeStore();
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', color: theme.colors.text }}>
      <thead>
        <tr style={{ borderBottom: `2px solid ${theme.colors.surfaceMuted}`, textAlign: 'left' }}>
          <th style={{ padding: '8px' }}>이름</th>
          <th style={{ padding: '8px' }}>아이디</th>
          <th style={{ padding: '8px' }}>팀</th>
          <th style={{ padding: '8px' }}>역할</th>
          <th style={{ padding: '8px' }}>상태</th>
          <th style={{ padding: '8px' }}>최근 접속</th>
          <th style={{ padding: '8px' }}>관리</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.idx} style={{ borderBottom: `1px solid ${theme.colors.surfaceMuted}` }}>
            <td style={{ padding: '8px' }}>{user.name}</td>
            <td style={{ padding: '8px' }}>{user.id}</td>
            <td style={{ padding: '8px' }}>{user.team ?? '—'}</td>
            <td style={{ padding: '8px' }}>{ROLE_LABEL[user.role] ?? user.role}</td>
            <td style={{ padding: '8px' }}>
              <ApprovalBadge status={user.status} />
            </td>
            <td style={{ padding: '8px', color: theme.colors.textMuted, fontSize: '13px' }}>
              {user.last_at ?? '—'}
            </td>
            <td style={{ padding: '8px', display: 'flex', gap: '4px' }}>
              <Button variant="secondary" onClick={() => onSelect(user)}>
                상세
              </Button>
              {onApprove && user.status === 'PENDING' && (
                <Button onClick={() => onApprove(user.idx)}>승인</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ApprovalBadge({ status }: { status: string }) {
  const { theme } = useThemeStore();
  const color =
    status === 'ACTIVE'
      ? theme.colors.success
      : status === 'PENDING'
        ? theme.colors.warning
        : theme.colors.textMuted;
  return (
    <span
      style={{
        color,
        fontWeight: 'bold',
        fontSize: '13px',
      }}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
