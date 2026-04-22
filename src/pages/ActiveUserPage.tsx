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
import { useAdminNavItems } from "../navigation";
import { getUsers } from "../services/userService";
import { UserDetailPage } from "./UserDetailPage";

const ACTIVE_ONLY = ["ACTIVE"];
/** TableBlock 상하 padding 합 (16*2). compact 모드 page 에서만 이 값. */
const TABLEBLOCK_PAD_Y = 32;
/** 테이블 컬럼 내부(flex container 안) overhead. 사이드 대시보드 min 과 비교할 때 사용. */
const INNER_OVERHEAD =
  LAYOUT.SEARCHBAR_H +
  LAYOUT.SEARCHBAR_MARGIN +
  TABLEBLOCK_PAD_Y +
  TABLE_THEAD_H +
  LAYOUT.PAGINATION_H;
const OVERHEAD =
  LAYOUT.HEADER_H + LAYOUT.FOOTER_H + LAYOUT.MAIN_PAD_Y + INNER_OVERHEAD;
/**
 * 대시보드 aside 의 min-content 높이 추정 (px).
 * - gradient 카드 ~113
 * - 계정 상태 분포 박스: h4 + 범례 + padding + 차트 min(160) ≈ 330
 * - stat list ~194
 * - aside padding + border ~26
 * - gap ~24
 * flex container `alignItems: stretch` 로 테이블 컬럼도 최소 이 높이가 보장됨.
 * UserStats.CHART_MIN_HEIGHT 와 연동 — 거기 값을 바꾸면 여기도 업데이트.
 */
const DASHBOARD_MIN_HEIGHT = 687;

export function ActiveUserPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();
  const sidebarItems = useAdminNavItems();
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const filterKey = JSON.stringify(filters);

  const pageSize = useFixedPageSize({
    overhead: OVERHEAD,
    rowHeight: TABLE_ROW_H,
    // 대시보드가 사이드에 있어 테이블 컬럼이 stretch 로 최소 DASHBOARD_MIN_HEIGHT
    // 까지 보장됨 → 뷰포트 기반 계산이 이보다 작을 때 이 값을 사용.
    minAvailable: DASHBOARD_MIN_HEIGHT - INNER_OVERHEAD,
  });

  const fetcher = useCallback(
    (
      cursor: string | undefined,
      snapshotIdx: number | undefined,
      size: number,
    ) =>
      getUsers({ status: ACTIVE_ONLY, ...filters }, cursor, snapshotIdx, size),
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
      sidebarItems={sidebarItems}
      version={__APP_VERSION__}
      contentMaxWidth="1700px"
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "stretch",
          flex: 1,
          // 27" QHD 에선 900px 을 선호하지만, 24" FHD 처럼 viewport 높이가 부족하면
          // main 이 스크롤되지 않게 100vh 기준으로 축소한다 (180 = header/footer/padding 합).
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
            <UserTable
              users={nav.items}
              onSelect={setSelectedUser}
              dateColumn="none"
            />
            {nav.loading && <TableEmptyState>로딩 중...</TableEmptyState>}
            {!nav.loading && nav.items.length === 0 && (
              <TableEmptyState>계정이 없습니다.</TableEmptyState>
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
