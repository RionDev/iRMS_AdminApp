import { AppLayout } from "@common/components/AppLayout";
import { TABLE_ROW_H, TABLE_THEAD_H } from "@common/components/BaseTable";
import { Pagination } from "@common/components/Pagination";
import { TableBlock } from "@common/components/TableBlock";
import { TableEmptyState } from "@common/components/TableEmptyState";
import { useAppAccess } from "@common/hooks/useAuth";
import { LAYOUT, useFixedPageSize } from "@common/hooks/useFixedPageSize";
import { useAppsStore } from "@common/stores/appsStore";
import { useThemeStore } from "@common/stores/themeStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppSearchBar,
  type AppSearchFilters,
} from "../components/AppSearchBar";
import { AppStats } from "../components/AppStats";
import { AppTable } from "../components/AppTable";
import { adminNavItems } from "../navigation";
import { getApps, updateApp } from "../services/appService";
import type { AdminApp } from "../types/app";

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
/** AppStats aside 의 min-content 높이 추정 (px). UserStats 와 동일 기준. */
const DASHBOARD_MIN_HEIGHT = 687;

export function ActiveAppPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();
  const [allApps, setAllApps] = useState<AdminApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [filters, setFilters] = useState<AppSearchFilters>({});
  const [page, setPage] = useState(1);

  const pageSize = useFixedPageSize({
    overhead: OVERHEAD,
    rowHeight: TABLE_ROW_H,
    minAvailable: DASHBOARD_MIN_HEIGHT - INNER_OVERHEAD,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getApps(undefined, undefined, 100)
      .then((res) => {
        if (cancelled) return;
        setAllApps(res.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    return allApps
      .filter((a) => a.is_active === 1)
      .filter((a) => {
        if (filters.name && !a.name.includes(filters.name)) return false;
        if (filters.path && !a.path.includes(filters.path)) return false;
        return true;
      });
  }, [allApps, filters]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const handleSearch = useCallback((next: AppSearchFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleBlock = useCallback(async (app: AdminApp) => {
    if (!window.confirm(`'${app.name}' 앱을 차단하시겠습니까?`)) return;
    await updateApp(app.idx, { is_active: 0 });
    await useAppsStore.getState().fetchApps();
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <AppLayout
      title="앱 허용 목록"
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
          <AppSearchBar onSearch={handleSearch} />
          <TableBlock>
            <AppTable
              apps={pagedItems}
              actionLabel="차단"
              actionVariant="secondary"
              onAction={handleBlock}
            />
            {loading && <TableEmptyState>로딩 중...</TableEmptyState>}
            {!loading && pagedItems.length === 0 && (
              <TableEmptyState>허용된 앱이 없습니다.</TableEmptyState>
            )}
            <div style={{ marginTop: "auto" }}>
              <Pagination
                page={safePage}
                totalPages={totalPages}
                total={total}
                hasPrev={safePage > 1}
                hasNext={safePage < totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                loading={loading}
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
    </AppLayout>
  );
}
