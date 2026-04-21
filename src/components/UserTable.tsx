import { BaseTable, type TableColumn } from '@common/components/BaseTable';
import { Button } from '@common/components/Button';
import type { VUser } from '@common/types/auth';
import { ROLE_LABEL } from '@common/types/constants';
import { useMemo } from 'react';

interface UserTableProps {
  users: VUser[];
  onSelect: (user: VUser) => void;
  onApprove?: (userIdx: number) => void;
  /** 마지막 컬럼으로 표시할 타임스탬프. 'none' 이면 날짜 컬럼을 숨긴다. */
  dateColumn?: 'last_at' | 'created_at' | 'none';
}

const DATE_COLUMN_LABEL: Record<'last_at' | 'created_at', string> = {
  last_at: '최근 접속',
  created_at: '생성 시간',
};

function formatTimestamp(value: string | null): string {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function UserTable({
  users,
  onSelect,
  onApprove,
  dateColumn = 'last_at',
}: UserTableProps) {
  const columns = useMemo<TableColumn<VUser>[]>(() => {
    const cols: TableColumn<VUser>[] = [
      { key: 'name', label: '이름' },
      { key: 'id', label: '아이디' },
      { key: 'team', label: '팀', render: (u) => u.team ?? 'N/A' },
      { key: 'role', label: '역할', render: (u) => ROLE_LABEL[u.role] ?? u.role },
    ];
    if (dateColumn !== 'none') {
      cols.push({
        key: dateColumn,
        label: DATE_COLUMN_LABEL[dateColumn],
        render: (u) => formatTimestamp(u[dateColumn]),
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
  }, [dateColumn, onApprove]);

  return (
    <BaseTable
      items={users}
      columns={columns}
      onRowClick={onSelect}
      rowKey={(u) => u.idx}
    />
  );
}
