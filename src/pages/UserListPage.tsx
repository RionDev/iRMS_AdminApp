import { AppLayout } from "@common/components/AppLayout";
import { useApi } from "@common/hooks/useApi";
import { useAppAccess } from "@common/hooks/useAuth";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import { useCallback, useEffect } from "react";
import { UserTable } from "../components/UserTable";
import { adminNavItems } from "../navigation";
import { approveUser, getUsers } from "../services/userService";

interface UserListPageProps {
  onSelectUser: (user: VUser) => void;
}

export function UserListPage({ onSelectUser }: UserListPageProps) {
  useAppAccess("/admin");
  const { theme } = useThemeStore();

  const fetcher = useCallback(() => getUsers(), []);
  const { data: users, loading, execute } = useApi(fetcher);
  const visibleUsers =
    users?.filter((user) => user.status !== "PENDING") ?? [];

  useEffect(() => {
    execute();
  }, [execute]);

  const handleApprove = async (userIdx: number) => {
    await approveUser({ user_idx: userIdx });
    execute();
  };

  return (
    <AppLayout
      title="회원 목록"
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
        {users && (
          <UserTable
            users={visibleUsers}
            onSelect={onSelectUser}
            onApprove={handleApprove}
          />
        )}
      </div>
    </AppLayout>
  );
}
