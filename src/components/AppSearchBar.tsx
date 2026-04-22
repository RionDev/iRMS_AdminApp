import { SearchBar } from "@common/components/SearchBar";
import { SearchInput } from "@common/components/SearchInput";
import { SearchSelect } from "@common/components/SearchSelect";
import { TEAM_OPTIONS } from "@common/types/constants";
import { useState } from "react";
import { TEAM_FULL } from "../types/app";

export interface AppSearchFilters {
  min_role?: number;
  team?: string;
  name?: string;
  path?: string;
}

interface AppSearchBarProps {
  onSearch: (filters: AppSearchFilters) => void;
}

/** min_role idx select options. 4=전체. */
const MIN_ROLE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "1", label: "관리자 이상" },
  { value: "2", label: "리드 이상" },
  { value: "3", label: "멤버 이상" },
  { value: "4", label: "전체" },
];

export function AppSearchBar({ onSearch }: AppSearchBarProps) {
  const [minRole, setMinRole] = useState("");
  const [team, setTeam] = useState("");
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const buildFilters = (): AppSearchFilters => {
    const filters: AppSearchFilters = {};
    if (minRole) filters.min_role = Number(minRole);
    if (team) filters.team = team;
    const trimmedName = name.trim();
    if (trimmedName) filters.name = trimmedName;
    const trimmedPath = path.trim();
    if (trimmedPath) filters.path = trimmedPath;
    return filters;
  };

  const handleSearch = () => {
    onSearch(buildFilters());
  };

  const handleReset = () => {
    setMinRole("");
    setTeam("");
    setName("");
    setPath("");
    onSearch({});
  };

  return (
    <SearchBar onSearch={handleSearch} onReset={handleReset}>
      <SearchSelect
        value={minRole}
        onChange={(e) => setMinRole(e.target.value)}
        aria-label="최소 등급"
      >
        <option value="">등급 전체</option>
        {MIN_ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SearchSelect>
      <SearchSelect
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        aria-label="허용 팀"
      >
        <option value="">팀 필터 없음</option>
        <option value={TEAM_FULL}>전체 (팀 제한 없음)</option>
        {TEAM_OPTIONS.map((opt) => (
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
        style={{ flex: 1 }}
      />
      <SearchInput
        placeholder="경로"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        aria-label="경로"
        style={{ flex: 1 }}
      />
    </SearchBar>
  );
}
