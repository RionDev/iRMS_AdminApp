import { Button } from "@common/components/Button";
import { Input } from "@common/components/Input";
import { Modal } from "@common/components/Modal";
import { useThemeStore } from "@common/stores/themeStore";
import { TEAM_OPTIONS } from "@common/types/constants";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createApp } from "../services/appService";
import { TEAM_FULL, type AdminApp, type AppTeam } from "../types/app";

interface AppCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (app: AdminApp) => void;
}

/** min_role idx select options. 4=전체. */
const MIN_ROLE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "1", label: "관리자 이상" },
  { value: "2", label: "리드 이상" },
  { value: "3", label: "멤버 이상" },
  { value: "4", label: "전체" },
];

export function AppCreateModal({ isOpen, onClose, onCreated }: AppCreateModalProps) {
  const { theme } = useThemeStore();
  const [path, setPath] = useState("");
  const [name, setName] = useState("");
  const [minRole, setMinRole] = useState("2");
  const [team, setTeam] = useState<AppTeam>(TEAM_FULL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPath("");
    setName("");
    setMinRole("2");
    setTeam(TEAM_FULL);
    setLoading(false);
    setError(null);
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedPath = path.trim();
    const trimmedName = name.trim();
    if (!trimmedPath || !trimmedName) {
      setError("경로와 이름은 필수입니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const app = await createApp({
        path: trimmedPath,
        name: trimmedName,
        min_role: Number(minRole),
        team,
      });
      onCreated(app);
      onClose();
    } catch (err) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "앱 등록에 실패했습니다.";
      setError(detail);
    } finally {
      setLoading(false);
    }
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
    <Modal isOpen={isOpen} onClose={onClose} title="앱 등록">
      <form onSubmit={handleSubmit}>
        <Input
          label="경로"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/example"
          required
        />
        <Input
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="표시 이름"
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

        {error && (
          <p
            style={{
              color: theme.colors.danger,
              fontSize: theme.fontSize.sm,
              marginTop: 0,
              marginBottom: "8px",
            }}
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            style={{ flex: 1 }}
            disabled={loading}
          >
            취소
          </Button>
          <Button type="submit" style={{ flex: 1 }} disabled={loading}>
            {loading ? "등록 중..." : "등록"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
