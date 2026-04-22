import { BaseTable, type TableColumn } from "@common/components/BaseTable";
import { Button } from "@common/components/Button";
import { TEAM_LABEL } from "@common/types/constants";
import { useMemo } from "react";
import type { AdminApp } from "../types/app";

/** min_role idx (1:ADMIN, 2:LEAD, 3:MEMBER) → 표시 라벨 ("X 이상"). null=전체 */
const MIN_ROLE_LABEL: Record<number, string> = {
  1: "관리자 이상",
  2: "리드 이상",
  3: "멤버 이상",
};

interface AppTableProps {
  apps: AdminApp[];
  actionLabel: string;
  actionVariant?: "primary" | "secondary";
  onAction: (app: AdminApp) => void;
}

export function AppTable({
  apps,
  actionLabel,
  actionVariant = "primary",
  onAction,
}: AppTableProps) {
  const columns = useMemo<TableColumn<AdminApp>[]>(
    () => [
      { key: "name", label: "이름" },
      { key: "path", label: "경로" },
      {
        key: "min_role",
        label: "최소 등급",
        render: (a) =>
          a.min_role == null ? "전체" : (MIN_ROLE_LABEL[a.min_role] ?? a.min_role),
      },
      {
        key: "team",
        label: "허용 팀",
        render: (a) => (a.team == null ? "전체" : TEAM_LABEL[a.team]),
      },
      {
        key: "actions",
        label: "관리",
        render: (a) => (
          <Button
            variant={actionVariant}
            onClick={(e) => {
              e.stopPropagation();
              onAction(a);
            }}
          >
            {actionLabel}
          </Button>
        ),
      },
    ],
    [actionLabel, actionVariant, onAction],
  );

  return <BaseTable items={apps} columns={columns} rowKey={(a) => a.idx} />;
}
