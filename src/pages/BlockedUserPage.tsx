import { AppLayout } from "@common/components/AppLayout";
import { TABLE_ROW_H, TABLE_THEAD_H } from "@common/components/BaseTable";
import { Drawer } from "@common/components/Drawer";
import { Pagination } from "@common/components/Pagination";
import { TableBlock } from "@common/components/TableBlock";
import { TableEmptyState } from "@common/components/TableEmptyState";
import { useAppAccess } from "@common/hooks/useAuth";
import { LAYOUT, useFixedPageSize } from "@common/hooks/useFixedPageSize";
import { usePagedNav } from "@common/hooks/usePagedNav";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import { useCallback, useState } from "react";
import {
  UserSearchBar,
  type UserSearchFilters,
} from "../components/UserSearchBar";
import { UserStats } from "../components/UserStats";
import { UserTable } from "../components/UserTable";
import { adminNavItems } from "../navigation";
import { getUsers } from "../services/userService";
import { UserDetailPage } from "./UserDetailPage";

const INACTIVE_ONLY = ["INACTIVE"];
/** TableBlock 상하 padding 합 (16*2). compact 모드 page 에서 이 값. */
const TABLEBLOCK_PAD_Y = 32;
const INNER_OVERHEAD =
  LAYOUT.SEARCHBAR_H +
  LAYOUT.SEARCHBAR_MARGIN +
  TABLEBLOCK_PAD_Y +
  TABLE_THEAD_H +
  LAYOUT.PAGINATION_H;
const OVERHEAD =
  LAYOUT.HEADER_H + LAYOUT.FOOTER_H + LAYOUT.MAIN_PAD_Y + INNER_OVERHEAD;
/** UserStats aside 의 min-content 높이 추정 (px). ActiveUserPage 와 동일 기준. */
const DASHBOARD_MIN_HEIGHT = 687;

export function BlockedUserPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const filterKey = JSON.stringify(filters);

  const pageSize = useFixedPageSize({
    overhead: OVERHEAD,
    rowHeight: TABLE_ROW_H,
    minAvailable: DASHBOARD_MIN_HEIGHT - INNER_OVERHEAD,
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
      contentMaxWidth="1700px"
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "stretch",
          flex: 1,
          minHeight: "min(900px, calc(100vh - 180px))",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          <UserSearchBar onSearch={setFilters} />
          <TableBlock>
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
        </div>
        <aside
          style={{
            width: "286px",
            flexShrink: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.colors.surface,
            padding: "12px",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow.card,
          }}
        >
          <UserStats reloadKey={reloadKey} />
        </aside>
      </div>
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
