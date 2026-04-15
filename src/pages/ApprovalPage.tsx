import { AppLayout } from "@common/components/AppLayout";
import { useApi } from "@common/hooks/useApi";
import { useAppAccess } from "@common/hooks/useAuth";
import { useThemeStore } from "@common/stores/themeStore";
import { useCallback, useEffect } from "react";
import { UserTable } from "../components/UserTable";
import { adminNavItems } from "../navigation";
import { approveUser, getUsers } from "../services/userService";

export function ApprovalPage() {
  useAppAccess("/admin");
  const { theme } = useThemeStore();

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, execute } = useApi(fetcher);

  useEffect(() => {
    execute();
  }, [execute]);

  const pendingUsers = users?.filter((u) => u.status === "PENDING") ?? [];

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <AppLayout
      title="가입 승인"
      appName="관리자 설정"
      sidebarItems={adminNavItems}
      version={__APP_VERSION__}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: "24px",
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.card,
        }}
      >
        {loading && <p>로딩 중...</p>}
        {pendingUsers.length === 0 && !loading && (
          <p style={{ color: theme.colors.textMuted }}>
            승인 대기 중인 사용자가 없습니다.
          </p>
        )}
        {pendingUsers.length > 0 && (
          <UserTable
            users={pendingUsers}
            onSelect={() => {}}
            onApprove={handleApprove}
          />
        )}
      </div>
    </AppLayout>
  );
}
