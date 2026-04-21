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

/** compact 모드 row 높이(px). useFixedPageSize 의 rowHeight 와 일치시켜야 한다. */
export const USER_TABLE_ROW_H_COMPACT = 40;
/** 일반 모드 row 높이(px). */
export const USER_TABLE_ROW_H_NORMAL = 44;
/** thead 높이(px). */
export const USER_TABLE_THEAD_H = 40;

export function UserTable({
  users,
  onSelect,
  onApprove,
  showLastAccess = true,
  compact = false,
}: UserTableProps) {
  const { theme } = useThemeStore();
  const showActions = Boolean(onApprove);
  const cellPadX = compact ? '20px' : '8px';
  const rowH = compact ? USER_TABLE_ROW_H_COMPACT : USER_TABLE_ROW_H_NORMAL;
  const nowrap = compact ? ('nowrap' as const) : undefined;
  const thStyle = {
    padding: `0 ${cellPadX}`,
    whiteSpace: nowrap,
    height: `${USER_TABLE_THEAD_H}px`,
    boxSizing: 'border-box' as const,
  };
  const tdStyle = {
    padding: `0 ${cellPadX}`,
    whiteSpace: nowrap,
    height: `${rowH}px`,
    boxSizing: 'border-box' as const,
  };
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        color: theme.colors.text,
        fontSize: theme.fontSize.base,
        textAlign: compact ? 'center' : 'left',
      }}
    >
      <thead>
        <tr style={{ borderBottom: `2px solid ${theme.colors.surfaceMuted}`, height: `${USER_TABLE_THEAD_H}px` }}>
          <th style={thStyle}>이름</th>
          <th style={thStyle}>아이디</th>
          <th style={thStyle}>팀</th>
          <th style={thStyle}>역할</th>
          {showLastAccess && <th style={thStyle}>최근 접속</th>}
          {showActions && <th style={thStyle}>관리</th>}
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
              height: `${rowH}px`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.surfaceMuted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <td style={tdStyle}>{user.name}</td>
            <td style={tdStyle}>{user.id}</td>
            <td style={tdStyle}>{user.team ?? 'N/A'}</td>
            <td style={tdStyle}>{ROLE_LABEL[user.role] ?? user.role}</td>
            {showLastAccess && (
              <td style={{ ...tdStyle, color: theme.colors.textMuted }}>
                {user.last_at ?? 'N/A'}
              </td>
            )}
            {showActions && (
              <td style={{ ...tdStyle, display: 'flex', gap: '4px', alignItems: 'center' }}>
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
