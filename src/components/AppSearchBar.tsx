import { SearchBar } from "@common/components/SearchBar";
import { SearchInput } from "@common/components/SearchInput";
import { useState } from "react";

export interface AppSearchFilters {
  name?: string;
  path?: string;
}

interface AppSearchBarProps {
  onSearch: (filters: AppSearchFilters) => void;
}

export function AppSearchBar({ onSearch }: AppSearchBarProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const buildFilters = (): AppSearchFilters => {
    const filters: AppSearchFilters = {};
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
    setName("");
    setPath("");
    onSearch({});
  };

  return (
    <SearchBar onSearch={handleSearch} onReset={handleReset}>
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
