import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@common/pages/LoginPage';
import { adminRoutes } from './routes';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/*" element={adminRoutes} />
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Routes>
  );
}
