import { AppLayout } from "@common/components/AppLayout";
import { Drawer } from "@common/components/Drawer";
import { Pagination } from "@common/components/Pagination";
import { useAppAccess } from "@common/hooks/useAuth";
import { usePagedNav } from "@common/hooks/usePagedNav";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import { useCallback, useRef, useState } from "react";
import {
  UserSearchBar,
  type UserSearchFilters,
} from "../components/UserSearchBar";
import { UserStats } from "../components/UserStats";
import { UserTable } from "../components/UserTable";
import { useDynamicPageSize } from "../hooks/useDynamicPageSize";
import { adminNavItems } from "../navigation";
import { getUsers } from "../services/userService";
import { UserDetailPage } from "./UserDetailPage";

const ACTIVE_ONLY = ["ACTIVE"];
const ROW_HEIGHT = 44;
const RESERVED_HEIGHT = 140;

export function ActiveUserPage() {
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
        { status: ACTIVE_ONLY, ...filters },
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
      title="계정 목록"
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
          minHeight: "900px",
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
          <div
            ref={tableContainerRef}
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.colors.surface,
              padding: "16px 20px",
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadow.card,
            }}
          >
            <UserTable
              users={nav.items}
              onSelect={setSelectedUser}
              showLastAccess={false}
              compact
            />
            {nav.loading && <p>로딩 중...</p>}
            {!nav.loading && nav.items.length === 0 && (
              <p style={{ color: theme.colors.textMuted }}>계정이 없습니다.</p>
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
          </div>
        </div>
        <aside
          style={{
            width: "286px",
            flexShrink: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.colors.surface,
            padding: "24px",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow.card,
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "12px",
              fontSize: theme.fontSize.lg,
              color: theme.colors.text,
            }}
          >
            대시보드
          </h3>
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
