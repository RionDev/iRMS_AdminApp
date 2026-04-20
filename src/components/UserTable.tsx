import type { VUser } from '@common/types/auth';
import { Button } from '@common/components/Button';
import { useThemeStore } from '@common/stores/themeStore';
import { ROLE_LABEL } from '@common/types/constants';

interface UserTableProps {
  users: VUser[];
  onSelect: (user: VUser) => void;
  onApprove?: (userIdx: number) => void;
  showLastAccess?: boolean;
  /** 컬럼을 내용 폭에 맞춰 조이고 좌측 정렬한다. 긴 리스트에서 테이블이 과도하게 늘어지지 않도록. */
  compact?: boolean;
}

export function UserTable({
  users,
  onSelect,
  onApprove,
  showLastAccess = true,
  compact = false,
}: UserTableProps) {
  const { theme } = useThemeStore();
  const showActions = Boolean(onApprove);
  const cellPad = compact ? '8px 20px' : '8px';
  const nowrap = compact ? ('nowrap' as const) : undefined;
  return (
    <table
      style={{
        width: compact ? 'auto' : '100%',
        borderCollapse: 'collapse',
        color: theme.colors.text,
        fontSize: theme.fontSize.base,
      }}
    >
      <thead>
        <tr style={{ borderBottom: `2px solid ${theme.colors.surfaceMuted}`, textAlign: 'left' }}>
          <th style={{ padding: cellPad, whiteSpace: nowrap }}>이름</th>
          <th style={{ padding: cellPad, whiteSpace: nowrap }}>아이디</th>
          <th style={{ padding: cellPad, whiteSpace: nowrap }}>팀</th>
          <th style={{ padding: cellPad, whiteSpace: nowrap }}>역할</th>
          {showLastAccess && <th style={{ padding: cellPad, whiteSpace: nowrap }}>최근 접속</th>}
          {showActions && <th style={{ padding: cellPad, whiteSpace: nowrap }}>관리</th>}
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
            <td style={{ padding: cellPad, whiteSpace: nowrap }}>{user.name}</td>
            <td style={{ padding: cellPad, whiteSpace: nowrap }}>{user.id}</td>
            <td style={{ padding: cellPad, whiteSpace: nowrap }}>{user.team ?? 'N/A'}</td>
            <td style={{ padding: cellPad, whiteSpace: nowrap }}>{ROLE_LABEL[user.role] ?? user.role}</td>
            {showLastAccess && (
              <td style={{ padding: cellPad, whiteSpace: nowrap, color: theme.colors.textMuted, fontSize: theme.fontSize.base }}>
                {user.last_at ?? 'N/A'}
              </td>
            )}
            {showActions && (
              <td style={{ padding: cellPad, display: 'flex', gap: '4px' }}>
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
