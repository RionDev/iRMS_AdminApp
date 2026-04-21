import { BaseTable, type TableColumn } from '@common/components/BaseTable';
import { Button } from '@common/components/Button';
import type { VUser } from '@common/types/auth';
import { ROLE_LABEL } from '@common/types/constants';
import { useMemo } from 'react';

interface UserTableProps {
  users: VUser[];
  onSelect: (user: VUser) => void;
  onApprove?: (userIdx: number) => void;
  showLastAccess?: boolean;
  /** 컬럼을 내용 폭에 맞춰 조이고 중앙 정렬한다. 긴 리스트에서 테이블이 과도하게 늘어지지 않도록. */
  compact?: boolean;
}

export function UserTable({
  users,
  onSelect,
  onApprove,
  showLastAccess = true,
  compact = false,
}: UserTableProps) {
  const columns = useMemo<TableColumn<VUser>[]>(() => {
    const cols: TableColumn<VUser>[] = [
      { key: 'name', label: '이름' },
      { key: 'id', label: '아이디' },
      { key: 'team', label: '팀', render: (u) => u.team ?? 'N/A' },
      { key: 'role', label: '역할', render: (u) => ROLE_LABEL[u.role] ?? u.role },
    ];
    if (showLastAccess) {
      cols.push({
        key: 'last_at',
        label: '최근 접속',
        render: (u) => u.last_at ?? 'N/A',
      });
    }
    if (onApprove) {
      cols.push({
        key: 'actions',
        label: '관리',
        render: (u) =>
          u.status === 'PENDING' ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(u.idx);
              }}
            >
              승인
            </Button>
          ) : null,
      });
    }
    return cols;
  }, [showLastAccess, onApprove]);

  return (
    <BaseTable
      items={users}
      columns={columns}
      onRowClick={onSelect}
      rowKey={(u) => u.idx}
      compact={compact}
    />
  );
}
