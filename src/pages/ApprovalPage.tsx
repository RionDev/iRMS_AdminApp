import { AppLayout } from "@common/components/AppLayout";
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
import { UserTable } from "../components/UserTable";
import { adminNavItems } from "../navigation";
import { approveUser, getUsers } from "../services/userService";

const PAGE_SIZE = 20;
const PENDING_ONLY = ["PENDING"];

export function ApprovalPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const filterKey = JSON.stringify(filters);

  const fetcher = useCallback(
    (cursor: string | undefined, snapshotIdx: number | undefined, size: number) =>
      getUsers(
        { status: PENDING_ONLY, ...filters },
        cursor,
        snapshotIdx,
        size,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey],
  );

  const nav = usePagedNav<VUser>({ fetcher, size: PAGE_SIZE, deps: [filterKey] });

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    nav.reset();
  };

  return (
    <AppLayout
      title="가입 승인"
      appName="관리자 설정"
      sidebarItems={adminNavItems}
      version={__APP_VERSION__}
    >
      <UserSearchBar onSearch={setFilters} />
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: "24px",
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
        }}
      >
        {nav.items.length > 0 && (
          <UserTable
            users={nav.items}
            onSelect={() => {}}
            onApprove={handleApprove}
          />
        )}
        {nav.loading && <p>로딩 중...</p>}
        {!nav.loading && nav.items.length === 0 && (
          <p style={{ color: theme.colors.textMuted }}>
            승인 대기 중인 사용자가 없습니다.
          </p>
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
    </AppLayout>
  );
}
