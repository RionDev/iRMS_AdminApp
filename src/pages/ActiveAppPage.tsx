import { AppLayout } from "@common/components/AppLayout";
import { TABLE_ROW_H, TABLE_THEAD_H } from "@common/components/BaseTable";
import { Button } from "@common/components/Button";
import { Drawer } from "@common/components/Drawer";
import { Pagination } from "@common/components/Pagination";
import { TableBlock } from "@common/components/TableBlock";
import { TableEmptyState } from "@common/components/TableEmptyState";
import { useAppAccess } from "@common/hooks/useAuth";
import { LAYOUT, useFixedPageSize } from "@common/hooks/useFixedPageSize";
import { usePagedNav } from "@common/hooks/usePagedNav";
import { useAppsStore } from "@common/stores/appsStore";
import { useThemeStore } from "@common/stores/themeStore";
import { useCallback, useState } from "react";
import { AppCreateModal } from "../components/AppCreateModal";
import {
  AppSearchBar,
  type AppSearchFilters,
} from "../components/AppSearchBar";
import { AppStats } from "../components/AppStats";
import { AppTable } from "../components/AppTable";
import { useRequireAdmin } from "../hooks/useRequireAdmin";
import { useAdminNavItems } from "../navigation";
import { getApps } from "../services/appService";
import type { AdminApp } from "../types/app";
import { AppDetailPage } from "./AppDetailPage";

const TABLEBLOCK_PAD_Y = 32;
/** 앱 등록 버튼 툴바 높이(버튼 32 + 하단 margin 8). */
const TOOLBAR_H = 40;
const INNER_OVERHEAD =
  TOOLBAR_H +
  LAYOUT.SEARCHBAR_H +
  LAYOUT.SEARCHBAR_MARGIN +
  TABLEBLOCK_PAD_Y +
  TABLE_THEAD_H +
  LAYOUT.PAGINATION_H;
const OVERHEAD =
  LAYOUT.HEADER_H + LAYOUT.FOOTER_H + LAYOUT.MAIN_PAD_Y + INNER_OVERHEAD;
const DASHBOARD_MIN_HEIGHT = 687;

export function ActiveAppPage() {
  useAppAccess("/admin");
  useRequireAdmin();
  const { theme } = useThemeStore();
  const sidebarItems = useAdminNavItems();
  const [filters, setFilters] = useState<AppSearchFilters>({});
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedApp, setSelectedApp] = useState<AdminApp | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const filterKey = JSON.stringify(filters);

  const pageSize = useFixedPageSize({
    overhead: OVERHEAD,
    rowHeight: TABLE_ROW_H,
    minAvailable: DASHBOARD_MIN_HEIGHT - INNER_OVERHEAD,
  });

  const fetcher = useCallback(
    (cursor: string | undefined, snapshotIdx: number | undefined, size: number) =>
      getApps({ is_active: 1, ...filters }, cursor, snapshotIdx, size),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey, reloadKey],
  );

  const nav = usePagedNav<AdminApp>({
    fetcher,
    size: pageSize,
    deps: [filterKey, reloadKey],
  });

  return (
    <AppLayout
      title="앱 허용 목록"
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "8px",
              height: "32px",
              flexShrink: 0,
            }}
          >
            <Button type="button" onClick={() => setCreateOpen(true)}>
              + 앱 등록
            </Button>
          </div>
          <AppSearchBar onSearch={setFilters} />
          <TableBlock>
            <AppTable apps={nav.items} onSelect={setSelectedApp} />
            {nav.loading && <TableEmptyState>로딩 중...</TableEmptyState>}
            {!nav.loading && nav.items.length === 0 && (
              <TableEmptyState>허용된 앱이 없습니다.</TableEmptyState>
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
          <AppStats reloadKey={reloadKey} />
        </aside>
      </div>
      <AppCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          await useAppsStore.getState().fetchApps();
          setReloadKey((k) => k + 1);
        }}
      />
      <Drawer
        isOpen={selectedApp !== null}
        onClose={() => setSelectedApp(null)}
      >
        {selectedApp && (
          <AppDetailPage
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onAfterUpdate={async () => {
              await useAppsStore.getState().fetchApps();
              setReloadKey((k) => k + 1);
            }}
            onAfterDelete={async () => {
              await useAppsStore.getState().fetchApps();
              setReloadKey((k) => k + 1);
            }}
          />
        )}
      </Drawer>
    </AppLayout>
  );
}
