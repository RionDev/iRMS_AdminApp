import { Button } from "@common/components/Button";
import { ChangePasswordModal } from "@common/components/AppLayout";
import { Input } from "@common/components/Input";
import { useAuth } from "@common/hooks/useAuth";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import {
  ROLE_OPTIONS,
  Role,
  STATUS_CODE,
  STATUS_OPTIONS,
  Status,
  TEAM_OPTIONS,
  Team,
  type RoleType,
  type StatusType,
  type TeamType,
} from "@common/types/constants";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { UpdateUserRequest } from "../types/user";

interface UserFormProps {
  user: VUser;
  onSubmit: (idx: number, data: UpdateUserRequest) => void;
  onDelete: (idx: number) => void;
  onCancel: () => void;
}

function formatTimestamp(value: string | null): string {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function UserForm({ user, onSubmit, onDelete, onCancel }: UserFormProps) {
  const { theme } = useThemeStore();
  const { user: currentUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [team, setTeam] = useState<TeamType>(
    (user.team as TeamType) ?? Team.ENGINE,
  );
  const [role, setRole] = useState<RoleType>(user.role ?? Role.MEMBER);
  const [status, setStatus] = useState<StatusType>(
    (user.status as StatusType) ?? Status.ACTIVE,
  );
  const [blockedReason, setBlockedReason] = useState("");
  const [pwModalOpen, setPwModalOpen] = useState(false);

  useEffect(() => {
    setName(user.name);
    setTeam((user.team as TeamType) ?? Team.ENGINE);
    setRole(user.role ?? Role.MEMBER);
    setStatus((user.status as StatusType) ?? Status.ACTIVE);
    setBlockedReason("");
  }, [user]);

  const isSelf = currentUser?.sub === user.idx;
  const isAdmin = currentUser?.role === Role.ADMIN;
  const statusChanged = status !== user.status;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: UpdateUserRequest = { name, team, role };
    if (statusChanged) {
      payload.status = STATUS_CODE[status];
      if (status === Status.INACTIVE && blockedReason.trim()) {
        const adminName = currentUser?.name ?? "";
        const now = new Date().toISOString();
        payload.blocked_reason = `${adminName}:${now}:${blockedReason.trim()}`;
      }
    }
    onSubmit(user.idx, payload);
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

  const metaRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  } as const;

  return (
    <form onSubmit={handleSubmit}>
      <p
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.fontSize.base,
          margin: "0 0 16px 0",
        }}
      >
        아이디: {user.id}
      </p>
      <Input
        label="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>팀</label>
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value as TeamType)}
          style={selectStyle}
        >
          {TEAM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>역할</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as RoleType)}
          style={selectStyle}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusType)}
          style={selectStyle}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {statusChanged && status === Status.INACTIVE && (
        <div style={{ marginBottom: "12px" }}>
          <Input
            label="차단 사유"
            value={blockedReason}
            onChange={(e) => setBlockedReason(e.target.value)}
            maxLength={100}
            placeholder="차단 사유를 입력하세요 (최대 100자)"
          />
        </div>
      )}

      <div
        style={{
          margin: "16px 0",
          padding: "12px",
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.surfaceMuted,
        }}
      >
        <div style={metaRowStyle}>
          <span>생성 시간</span>
          <span>{formatTimestamp(user.created_at)}</span>
        </div>
        <div style={metaRowStyle}>
          <span>변경 시간</span>
          <span>{formatTimestamp(user.updated_at)}</span>
        </div>
        <div style={metaRowStyle}>
          <span>마지막 접속</span>
          <span>{formatTimestamp(user.last_at)}</span>
        </div>
      </div>

      {isSelf && (
        <Button
          variant="secondary"
          type="button"
          onClick={() => setPwModalOpen(true)}
          style={{ width: "100%", marginBottom: "8px" }}
        >
          비밀번호 변경
        </Button>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <Button type="submit" style={{ flex: 1 }}>
          저장
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          style={{ flex: 1 }}
        >
          취소
        </Button>
        {isAdmin && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => onDelete(user.idx)}
            style={{ color: theme.colors.danger }}
          >
            삭제
          </Button>
        )}
      </div>

      <ChangePasswordModal
        isOpen={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
      />
    </form>
  );
}
