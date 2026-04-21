import { AppLayout } from "@common/components/AppLayout";
import { Drawer } from "@common/components/Drawer";
import { Pagination } from "@common/components/Pagination";
import { TableBlock } from "@common/components/TableBlock";
import { useAppAccess } from "@common/hooks/useAuth";
import { useDynamicPageSize } from "@common/hooks/useDynamicPageSize";
import { usePagedNav } from "@common/hooks/usePagedNav";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import { useCallback, useRef, useState } from "react";
import {
  UserSearchBar,
  type UserSearchFilters,
} from "../components/UserSearchBar";
import { UserTable } from "../components/UserTable";
import { adminNavItems } from "../navigation";
import { getUsers } from "../services/userService";
import { UserDetailPage } from "./UserDetailPage";

const INACTIVE_ONLY = ["INACTIVE"];
const ROW_HEIGHT = 48;
const RESERVED_HEIGHT = 160;

export function BlockedUserPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const filterKey = JSON.stringify(filters);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const pageSize = useDynamicPageSize(tableContainerRef, {
    rowHeight: ROW_HEIGHT,
    reservedHeight: RESERVED_HEIGHT,
  });

  const fetcher = useCallback(
    (cursor: string | undefined, snapshotIdx: number | undefined, size: number) =>
      getUsers(
        { status: INACTIVE_ONLY, ...filters },
        cursor,
        snapshotIdx,
        size,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey, reloadKey],
  );

  const nav = usePagedNav<VUser>({
    fetcher,
    size: pageSize,
    deps: [filterKey, reloadKey],
  });

  return (
    <AppLayout
      title="차단 계정"
      appName="관리자 설정"
      sidebarItems={adminNavItems}
      version={__APP_VERSION__}
    >
      <UserSearchBar onSearch={setFilters} />
      <TableBlock ref={tableContainerRef} padding="24px">
        <UserTable users={nav.items} onSelect={setSelectedUser} />
        {nav.loading && <p>로딩 중...</p>}
        {!nav.loading && nav.items.length === 0 && (
          <p style={{ color: theme.colors.textMuted }}>차단된 계정이 없습니다.</p>
        )}
        <div style={{ marginTop: "auto" }}>
          <Pagination
            page={nav.page}
            totalPages={nav.totalPages}
            total={nav.total}
            hasPrev={nav.hasPrev}
            hasNext={nav.hasNext}
            onPrev={nav.prev}
            onNext={nav.next}
            loading={nav.loading}
          />
        </div>
      </TableBlock>
      <Drawer
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <UserDetailPage
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onAfterDelete={() => setReloadKey((k) => k + 1)}
          />
        )}
      </Drawer>
    </AppLayout>
  );
}
