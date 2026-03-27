import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { VUser } from '@common/types/auth';
import { UserListPage } from './pages/UserListPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { ApprovalPage } from './pages/ApprovalPage';

function AdminRoutes() {
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);

  if (selectedUser) {
    return <UserDetailPage user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <Routes>
      <Route path="/admin/users" element={<UserListPage onSelectUser={setSelectedUser} />} />
      <Route path="/admin/approval" element={<ApprovalPage />} />
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Routes>
  );
}

export const adminRoutes = <AdminRoutes />;
