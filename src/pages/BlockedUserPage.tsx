import { AppLayout } from "@common/components/AppLayout";
import { TABLE_ROW_H, TABLE_THEAD_H } from "@common/components/BaseTable";
import { Drawer } from "@common/components/Drawer";
import { Pagination } from "@common/components/Pagination";
import { TableBlock } from "@common/components/TableBlock";
import { TableEmptyState } from "@common/components/TableEmptyState";
import { useAppAccess } from "@common/hooks/useAuth";
import { LAYOUT, useFixedPageSize } from "@common/hooks/useFixedPageSize";
import { usePagedNav } from "@common/hooks/usePagedNav";
import type { VUser } from "@common/types/auth";
import { useCallback, useState } from "react";
import {
  UserSearchBar,
  type UserSearchFilters,
} from "../components/UserSearchBar";
import { UserTable } from "../components/UserTable";
import { adminNavItems } from "../navigation";
import { getUsers } from "../services/userService";
import { UserDetailPage } from "./UserDetailPage";

const INACTIVE_ONLY = ["INACTIVE"];
/** TableBlock 상하 padding 합 (24*2). */
const TABLEBLOCK_PAD_Y = 48;
const OVERHEAD =
  LAYOUT.HEADER_H +
  LAYOUT.FOOTER_H +
  LAYOUT.MAIN_PAD_Y +
  LAYOUT.SEARCHBAR_H +
  LAYOUT.SEARCHBAR_MARGIN +
  TABLEBLOCK_PAD_Y +
  TABLE_THEAD_H +
  LAYOUT.PAGINATION_H;

export function BlockedUserPage() {
  useAppAccess("/admin");
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const filterKey = JSON.stringify(filters);

  const pageSize = useFixedPageSize({
    overhead: OVERHEAD,
    rowHeight: TABLE_ROW_H,
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
      <TableBlock padding="24px">
        <UserTable users={nav.items} onSelect={setSelectedUser} />
        {nav.loading && <TableEmptyState>로딩 중...</TableEmptyState>}
        {!nav.loading && nav.items.length === 0 && (
          <TableEmptyState>차단된 계정이 없습니다.</TableEmptyState>
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
