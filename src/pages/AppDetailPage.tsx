import { Button } from "@common/components/Button";
import { useThemeStore } from "@common/stores/themeStore";
import { useState } from "react";
import { AppForm } from "../components/AppForm";
import { deleteApp, updateApp } from "../services/appService";
import type { AdminApp, UpdateAppRequest } from "../types/app";

interface AppDetailPageProps {
  app: AdminApp;
  onClose: () => void;
  onAfterUpdate?: () => void;
  onAfterDelete?: () => void;
}

/**
 * 앱 상세/수정 패널. Drawer 내부에서 렌더되는 body-only 컴포넌트.
 */
export function AppDetailPage({
  app,
  onClose,
  onAfterUpdate,
  onAfterDelete,
}: AppDetailPageProps) {
  const { theme } = useThemeStore();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (idx: number, data: UpdateAppRequest) => {
    setMessage(null);
    try {
      await updateApp(idx, data);
      setMessage("수정되었습니다.");
      onAfterUpdate?.();
    } catch {
      // interceptor가 alert 처리
    }
  };

  const handleDelete = async (idx: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteApp(idx);
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
          앱 상세
        </h2>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </div>
      <AppForm app={app} onSubmit={handleSubmit} onDelete={handleDelete} />
      {message && (
        <p style={{ color: theme.colors.success, marginTop: "12px" }}>
          {message}
        </p>
      )}
    </div>
  );
}
