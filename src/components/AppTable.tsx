import { BaseTable, type TableColumn } from "@common/components/BaseTable";
import { TEAM_LABEL, type TeamType } from "@common/types/constants";
import { useMemo } from "react";
import { TEAM_FULL, type AdminApp } from "../types/app";

/** min_role idx → 표시 라벨. 4(GUEST) 는 "전체"로 노출. */
const MIN_ROLE_LABEL: Record<number, string> = {
  1: "관리자 이상",
  2: "리드 이상",
  3: "멤버 이상",
  4: "전체",
};

interface AppTableProps {
  apps: AdminApp[];
  onSelect?: (app: AdminApp) => void;
}

export function AppTable({ apps, onSelect }: AppTableProps) {
  const columns = useMemo<TableColumn<AdminApp>[]>(
    () => [
      { key: "name", label: "이름" },
      { key: "path", label: "경로" },
      {
        key: "min_role",
        label: "최소 등급",
        render: (a) => MIN_ROLE_LABEL[a.min_role] ?? a.min_role,
      },
      {
        key: "team",
        label: "허용 팀",
        render: (a) =>
          a.team === TEAM_FULL ? "전체" : TEAM_LABEL[a.team as TeamType],
      },
    ],
    [],
  );

  return (
    <BaseTable
      items={apps}
      columns={columns}
      rowKey={(a) => a.idx}
      onRowClick={onSelect}
    />
  );
}
