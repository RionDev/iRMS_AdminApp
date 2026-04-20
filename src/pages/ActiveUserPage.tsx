import { AppLayout } from "@common/components/AppLayout";
import { Drawer } from "@common/components/Drawer";
import { Pagination } from "@common/components/Pagination";
import { useAppAccess } from "@common/hooks/useAuth";
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

const PAGE_SIZE = 20;
const ACTIVE_ONLY = ["ACTIVE"];

export function ActiveUserPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const filterKey = JSON.stringify(filters);

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
    size: PAGE_SIZE,
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
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "1350px",
            flexShrink: 0,
          }}
        >
          <UserSearchBar onSearch={setFilters} />
          <div
            style={{
              backgroundColor: theme.colors.surface,
              padding: "24px",
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
        <aside
          style={{
            flex: 1,
            minWidth: 0,
            alignSelf: "stretch",
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
