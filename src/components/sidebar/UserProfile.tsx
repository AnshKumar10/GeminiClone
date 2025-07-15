import { LogOut } from "lucide-react";
import type { User } from "../../store/useStore";
import { IconButton } from "../ButtonWithIcon";

export const UserProfile: React.FC<{ user: User; onLogout: () => void }> = ({
  user,
  onLogout,
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#2a2a2a] rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow">
        <span className="text-white text-sm font-semibold">
          {user?.phone?.slice(-2) || "U"}
        </span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {user?.phone || "User"}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
      </div>
    </div>
    <IconButton
      icon={LogOut}
      onClick={onLogout}
      variant="ghost"
      size="sm"
      ariaLabel="Logout"
      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
    />
  </div>
);
