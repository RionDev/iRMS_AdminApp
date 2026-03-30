import { useState } from 'react';
import type { VUser } from '@common/types/auth';
import { UserListPage } from './pages/UserListPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { ApprovalPage } from './pages/ApprovalPage';

function UserListWithDetail() {
  const [selectedUser, setSelectedUser] = useState<VUser | null>(null);

  if (selectedUser) {
    return <UserDetailPage user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return <UserListPage onSelectUser={setSelectedUser} />;
}

export const adminRoutes = {
  userList: <UserListWithDetail />,
  approval: <ApprovalPage />,
};
