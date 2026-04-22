import { ActiveAppPage } from "./pages/ActiveAppPage";
import { ActiveUserPage } from "./pages/ActiveUserPage";
import { ApprovalPage } from "./pages/ApprovalPage";
import { BlockedAppPage } from "./pages/BlockedAppPage";
import { BlockedUserPage } from "./pages/BlockedUserPage";

export const adminRoutes = {
  userList: <ActiveUserPage />,
  blockedList: <BlockedUserPage />,
  approval: <ApprovalPage />,
  appList: <ActiveAppPage />,
  blockedAppList: <BlockedAppPage />,
};
