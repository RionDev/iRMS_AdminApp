import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@common/pages/LoginPage';
import { SignupPage } from '@common/pages/SignupPage';

import { useAuthStore } from '@common/stores/authStore';
import { adminRoutes } from './routes';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
    return null;
  }
  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage signupUrl="/admin/signup" defaultRedirect="/admin/users" />} />
      <Route path="/signup" element={<SignupPage loginUrl="/admin/login" />} />
      <Route path="/users" element={<RequireAuth>{adminRoutes.userList}</RequireAuth>} />
      <Route path="/approval" element={<RequireAuth>{adminRoutes.approval}</RequireAuth>} />
      <Route path="/blocked" element={<RequireAuth>{adminRoutes.blockedList}</RequireAuth>} />
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}
