import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@common/components/Input';
import { Button } from '@common/components/Button';
import { useThemeStore } from '@common/stores/themeStore';
import {
  ROLE_OPTIONS,
  Role,
  TEAM_OPTIONS,
  Team,
  type RoleType,
  type TeamType,
} from '@common/types/constants';
import type { VUser } from '@common/types/auth';
import type { UpdateUserRequest } from '../types/user';

interface UserFormProps {
  user: VUser;
  onSubmit: (idx: number, data: UpdateUserRequest) => void;
  onDelete: (idx: number) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onDelete, onCancel }: UserFormProps) {
  const { theme } = useThemeStore();
  const [name, setName] = useState(user.name);
  const [team, setTeam] = useState<TeamType>(
    (user.team as TeamType) ?? Team.ENGINE,
  );
  const [role, setRole] = useState<RoleType>(user.role ?? Role.MEMBER);

  useEffect(() => {
    setName(user.name);
    setTeam((user.team as TeamType) ?? Team.ENGINE);
    setRole(user.role ?? Role.MEMBER);
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(user.idx, { name, team, role });
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: theme.fontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  } as const;

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSize.base, margin: '0 0 16px 0' }}>
        아이디: {user.id}
      </p>
      <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} required />
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: theme.fontSize.base, color: theme.colors.text }}>팀</label>
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
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: theme.fontSize.base, color: theme.colors.text }}>역할</label>
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
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button type="submit" style={{ flex: 1 }}>저장</Button>
        <Button variant="secondary" type="button" onClick={onCancel} style={{ flex: 1 }}>
          취소
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => onDelete(user.idx)}
          style={{ color: theme.colors.danger }}
        >
          삭제
        </Button>
      </div>
    </form>
  );
}
