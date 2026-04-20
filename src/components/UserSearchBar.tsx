import { SearchBar } from '@common/components/SearchBar';
import { SearchInput } from '@common/components/SearchInput';
import { SearchSelect } from '@common/components/SearchSelect';
import { ROLE_OPTIONS, TEAM_OPTIONS } from '@common/types/constants';
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
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');

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

  const handleSearch = () => {
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
    <SearchBar onSearch={handleSearch} onReset={handleReset}>
      <SearchSelect
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        aria-label="팀"
      >
        <option value="">팀 전체</option>
        {TEAM_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SearchSelect>
      <SearchSelect
        value={role}
        onChange={(e) => setRole(e.target.value)}
        aria-label="역할"
      >
        <option value="">역할 전체</option>
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SearchSelect>
      <SearchInput
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="이름"
      />
      <SearchInput
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
        aria-label="아이디"
      />
    </SearchBar>
  );
}
