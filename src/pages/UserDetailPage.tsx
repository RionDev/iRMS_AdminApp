import { Avatar } from "@common/components/Avatar";
import { Button } from "@common/components/Button";
import { useThemeStore } from "@common/stores/themeStore";
import type { VUser } from "@common/types/auth";
import { useState } from "react";
import { UserForm } from "../components/UserForm";
import { deleteUser, updateUser } from "../services/userService";
import type { UpdateUserRequest } from "../types/user";

interface UserDetailPageProps {
  user: VUser;
  onClose: () => void;
  onAfterDelete?: () => void;
}

/**
 * 회원 상세/수정 패널. Drawer 내부에서 렌더되는 body-only 컴포넌트.
 */
export function UserDetailPage({ user, onClose, onAfterDelete }: UserDetailPageProps) {
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
      onAfterDelete?.();
      onClose();
    } catch {
      // interceptor가 alert 처리
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: theme.fontSize.xl,
            color: theme.colors.text,
          }}
        >
          회원 상세
        </h2>
        <Button variant="secondary" onClick={onClose}>
          닫기
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
        onCancel={onClose}
      />
      {message && (
        <p style={{ color: theme.colors.success, marginTop: "12px" }}>
          {message}
        </p>
      )}
    </div>
  );
}
