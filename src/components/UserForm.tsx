import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@common/components/Input';
import { Button } from '@common/components/Button';
import { Role, Team } from '@common/types/constants';
import { theme } from '@common/styles/theme';
import type { VUser } from '@common/types/auth';
import type { UpdateUserRequest } from '../types/user';

interface UserFormProps {
  user: VUser;
  onSubmit: (idx: number, data: UpdateUserRequest) => void;
  onDelete: (idx: number) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onDelete, onCancel }: UserFormProps) {
  const [name, setName] = useState(user.name);
  const [team, setTeam] = useState<number>(Team.ENGINE);
  const [role, setRole] = useState<number>(Role.MEMBER);

  useEffect(() => {
    setName(user.name);
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(user.idx, { name, team, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ color: theme.colors.textMuted, fontSize: '14px', margin: '0 0 16px 0' }}>
        아이디: {user.id}
      </p>
      <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} required />
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: theme.colors.text }}>팀</label>
        <select
          value={team}
          onChange={(e) => setTeam(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: theme.radius.sm,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: theme.fontFamily,
            color: theme.colors.text,
          }}
        >
          <option value={Team.ENGINE}>엔진</option>
          <option value={Team.ANALYST}>분석</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: theme.colors.text }}>역할</label>
        <select
          value={role}
          onChange={(e) => setRole(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: theme.radius.sm,
            border: `1px solid ${theme.colors.border}`,
            fontFamily: theme.fontFamily,
            color: theme.colors.text,
          }}
        >
          <option value={Role.MEMBER}>멤버</option>
          <option value={Role.LEAD}>리드</option>
          <option value={Role.ADMIN}>관리자</option>
          <option value={Role.GUEST}>게스트</option>
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
