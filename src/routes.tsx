import { ActiveUserPage } from "./pages/ActiveUserPage";
import { ApprovalPage } from "./pages/ApprovalPage";
import { BlockedUserPage } from "./pages/BlockedUserPage";

export const adminRoutes = {
  userList: <ActiveUserPage />,
  blockedList: <BlockedUserPage />,
  approval: <ApprovalPage />,
};
