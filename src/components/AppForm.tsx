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

/** api_key_enabled select options. 1:허용, 0:불허 */
const API_KEY_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "0", label: "불허" },
  { value: "1", label: "허용" },
];

export function AppForm({ app, onSubmit, onDelete }: AppFormProps) {
  const { theme } = useThemeStore();
  const { user: currentUser } = useAuth();

  const initialMinRole = String(app.min_role);
  const initialTeam: AppTeam = app.team;
  const initialActive = String(app.is_active);
  const initialApiKey = String(app.api_key_enabled);

  const [name, setName] = useState(app.name);
  const [minRole, setMinRole] = useState<string>(initialMinRole);
  const [team, setTeam] = useState<AppTeam>(initialTeam);
  const [isActive, setIsActive] = useState<string>(initialActive);
  const [apiKeyEnabled, setApiKeyEnabled] = useState<string>(initialApiKey);

  useEffect(() => {
    setName(app.name);
    setMinRole(String(app.min_role));
    setTeam(app.team);
    setIsActive(String(app.is_active));
    setApiKeyEnabled(String(app.api_key_enabled));
  }, [app]);

  const isAdmin = currentUser?.role === Role.ADMIN;
  const isDirty =
    name !== app.name ||
    minRole !== initialMinRole ||
    team !== initialTeam ||
    isActive !== initialActive ||
    apiKeyEnabled !== initialApiKey;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;
    const payload: UpdateAppRequest = {
      name,
      min_role: Number(minRole),
      team,
      is_active: Number(isActive),
      api_key_enabled: Number(apiKeyEnabled),
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

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>API 키 허용</label>
        <select
          value={apiKeyEnabled}
          onChange={(e) => setApiKeyEnabled(e.target.value)}
          style={selectStyle}
        >
          {API_KEY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p style={{ margin: "4px 0 0", fontSize: theme.fontSize.sm, color: theme.colors.textMuted }}>
          허용하면 사용자가 이 앱을 API 키의 범위로 고를 수 있습니다. 불허로 바꾸면 이미 만든 키도 이 앱에서는 바로 막힙니다.
        </p>
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
