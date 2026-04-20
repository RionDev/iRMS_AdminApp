import { Button } from '@common/components/Button';
import { useThemeStore } from '@common/stores/themeStore';
import { ROLE_OPTIONS, TEAM_OPTIONS } from '@common/types/constants';
import type { FormEvent } from 'react';
import { useState } from 'react';

export interface UserSearchFilters {
  team?: string;
  role?: string;
  name?: string;
  id?: string;
}

interface UserSearchBarProps {
  onSearch: (filters: UserSearchFilters) => void;
}

export function UserSearchBar({ onSearch }: UserSearchBarProps) {
  const { theme } = useThemeStore();
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const selectStyle = {
    padding: '8px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    minWidth: '120px',
  } as const;

  const inputStyle = {
    padding: '8px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.base,
    boxSizing: 'border-box',
    minWidth: '140px',
  } as const;

  const buildFilters = (): UserSearchFilters => {
    const filters: UserSearchFilters = {};
    if (team) filters.team = team;
    if (role) filters.role = role;
    const trimmedName = name.trim();
    if (trimmedName) filters.name = trimmedName;
    const trimmedId = id.trim();
    if (trimmedId) filters.id = trimmedId;
    return filters;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const filters = buildFilters();
    if (Object.keys(filters).length === 0) return;
    onSearch(filters);
  };

  const handleReset = () => {
    setTeam('');
    setRole('');
    setName('');
    setId('');
    onSearch({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        marginBottom: '16px',
      }}
    >
      <select
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        style={selectStyle}
        aria-label="팀"
      >
        <option value="">팀 전체</option>
        {TEAM_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={selectStyle}
        aria-label="역할"
      >
        <option value="">역할 전체</option>
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        aria-label="이름"
      />
      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={inputStyle}
        aria-label="아이디"
      />
      <Button type="submit">검색</Button>
      <Button type="button" variant="secondary" onClick={handleReset}>
        초기화
      </Button>
    </form>
  );
}
