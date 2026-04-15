import { AppLayout } from "@common/components/AppLayout";
import { Avatar } from "@common/components/Avatar";
import { Button } from "@common/components/Button";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import { useState } from "react";
import { UserForm } from "../components/UserForm";
import { adminNavItems } from "../navigation";
import { deleteUser, updateUser } from "../services/userService";
import type { UpdateUserRequest } from "../types/user";

interface UserDetailPageProps {
  user: VUser;
  onBack: () => void;
}

export function UserDetailPage({ user, onBack }: UserDetailPageProps) {
  const { theme } = useThemeStore();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (idx: number, data: UpdateUserRequest) => {
    setMessage(null);
    try {
      await updateUser(idx, data);
      setMessage("수정되었습니다.");
    } catch {
      // interceptor가 alert 처리
    }
  };

  const handleDelete = async (idx: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteUser(idx);
      onBack();
    } catch {
      // interceptor가 alert 처리
    }
  };

  return (
    <AppLayout
      title="회원 상세"
      appName="관리자 설정"
      sidebarItems={adminNavItems}
      version={__APP_VERSION__}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: "24px",
          borderRadius: theme.radius.md,
          maxWidth: "480px",
          boxShadow: theme.shadow.card,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button variant="secondary" onClick={onBack}>
            목록으로
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 0 20px",
          }}
        >
          <Avatar name={user.name} size={80} />
        </div>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={onBack}
        />
        {message && (
          <p style={{ color: theme.colors.success, marginTop: "12px" }}>
            {message}
          </p>
        )}
      </div>
    </AppLayout>
  );
}
