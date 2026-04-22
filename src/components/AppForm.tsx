import { Button } from "@common/components/Button";
import { Input } from "@common/components/Input";
import { useAuth } from "@common/hooks/useAuth";
import { useThemeStore } from "@common/stores/themeStore";
import { Role, TEAM_OPTIONS } from "@common/types/constants";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { TEAM_FULL, type AdminApp, type AppTeam, type UpdateAppRequest } from "../types/app";

interface AppFormProps {
  app: AdminApp;
  onSubmit: (idx: number, data: UpdateAppRequest) => void;
  onDelete: (idx: number) => void;
}

/** min_role idx(1:ADMIN, 2:LEAD, 3:MEMBER, 4:GUEST=전체) select options. */
const MIN_ROLE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "1", label: "관리자 이상" },
  { value: "2", label: "리드 이상" },
  { value: "3", label: "멤버 이상" },
  { value: "4", label: "전체" },
];

/** is_active select options. 1:활성, 0:비활성 */
const ACTIVE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "1", label: "활성" },
  { value: "0", label: "비활성" },
];

export function AppForm({ app, onSubmit, onDelete }: AppFormProps) {
  const { theme } = useThemeStore();
  const { user: currentUser } = useAuth();

  const initialMinRole = String(app.min_role);
  const initialTeam: AppTeam = app.team;
  const initialActive = String(app.is_active);

  const [name, setName] = useState(app.name);
  const [minRole, setMinRole] = useState<string>(initialMinRole);
  const [team, setTeam] = useState<AppTeam>(initialTeam);
  const [isActive, setIsActive] = useState<string>(initialActive);

  useEffect(() => {
    setName(app.name);
    setMinRole(String(app.min_role));
    setTeam(app.team);
    setIsActive(String(app.is_active));
  }, [app]);

  const isAdmin = currentUser?.role === Role.ADMIN;
  const isDirty =
    name !== app.name ||
    minRole !== initialMinRole ||
    team !== initialTeam ||
    isActive !== initialActive;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;
    const payload: UpdateAppRequest = {
      name,
      min_role: Number(minRole),
      team,
      is_active: Number(isActive),
    };
    onSubmit(app.idx, payload);
  };

  const selectStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: theme.fontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  } as const;

  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  } as const;

  return (
    <form onSubmit={handleSubmit}>
      <Input label="경로" value={app.path} disabled />
      <Input
        label="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>최소 등급</label>
        <select
          value={minRole}
          onChange={(e) => setMinRole(e.target.value)}
          style={selectStyle}
        >
          {MIN_ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>허용 팀</label>
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value as AppTeam)}
          style={selectStyle}
        >
          <option value={TEAM_FULL}>전체</option>
          {TEAM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>상태</label>
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          style={selectStyle}
        >
          {ACTIVE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={!isDirty} style={{ width: "100%" }}>
        저장
      </Button>
      {isAdmin && (
        <Button
          variant="secondary"
          type="button"
          onClick={() => onDelete(app.idx)}
          style={{
            width: "100%",
            marginTop: "8px",
            color: theme.colors.danger,
          }}
        >
          삭제
        </Button>
      )}
    </form>
  );
}
