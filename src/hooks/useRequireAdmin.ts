import { useAuthStore } from "@common/stores/authStore";
import { Role } from "@common/types/constants";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 현재 로그인 유저가 Admin 이 아니면 지정 경로로 리다이렉트한다.
 * 앱 관리처럼 app_service 가 Admin 전용인 페이지에 사용.
 */
export function useRequireAdmin(redirectTo = "/users"): void {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.role !== Role.ADMIN) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);
}
