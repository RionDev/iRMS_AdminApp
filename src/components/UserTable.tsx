import type { VUser } from '@common/types/auth';
import { Button } from '@common/components/Button';
import { useThemeStore } from '@common/stores/themeStore';
import { ROLE_LABEL } from '@common/types/constants';

interface UserTableProps {
  users: VUser[];
  onSelect: (user: VUser) => void;
  onApprove?: (userIdx: number) => void;
  showLastAccess?: boolean;
}

export function UserTable({
  users,
  onSelect,
  onApprove,
  showLastAccess = true,
}: UserTableProps) {
  const { theme } = useThemeStore();
  const showActions = Boolean(onApprove);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', color: theme.colors.text, fontSize: theme.fontSize.base }}>
      <thead>
        <tr style={{ borderBottom: `2px solid ${theme.colors.surfaceMuted}`, textAlign: 'left' }}>
          <th style={{ padding: '8px' }}>이름</th>
          <th style={{ padding: '8px' }}>아이디</th>
          <th style={{ padding: '8px' }}>팀</th>
          <th style={{ padding: '8px' }}>역할</th>
          {showLastAccess && <th style={{ padding: '8px' }}>최근 접속</th>}
          {showActions && <th style={{ padding: '8px' }}>관리</th>}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.idx}
            onClick={() => onSelect(user)}
            style={{
              borderBottom: `1px solid ${theme.colors.surfaceMuted}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.surfaceMuted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <td style={{ padding: '8px' }}>{user.name}</td>
            <td style={{ padding: '8px' }}>{user.id}</td>
            <td style={{ padding: '8px' }}>{user.team ?? 'N/A'}</td>
            <td style={{ padding: '8px' }}>{ROLE_LABEL[user.role] ?? user.role}</td>
            {showLastAccess && (
              <td style={{ padding: '8px', color: theme.colors.textMuted, fontSize: theme.fontSize.base }}>
                {user.last_at ?? 'N/A'}
              </td>
            )}
            {showActions && (
              <td style={{ padding: '8px', display: 'flex', gap: '4px' }}>
                {onApprove && user.status === 'PENDING' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(user.idx);
                    }}
                  >
                    승인
                  </Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
