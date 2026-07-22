import { Avatar, Button, ScrollShadow } from "@heroui/react";
import { LuChevronsLeft, LuSun, LuMoon } from "react-icons/lu";
import { SideBarConfig } from "@/config/sidebard.config";
import { SidebarItem } from "./SidebarItem";
import { HiOutlineMinusCircle } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/components/providers/AuthContext";
import { useTheme } from "@/hooks/useTheme";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useLocalStorage("sidebar-is-open", true);
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={cn(
        "h-screen transition-all duration-300 ease-in-out sticky top-0 left-0 bg-white dark:bg-[#121212] border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 text-zinc-900 dark:text-white z-50",
        isOpen ? "w-72" : "w-20",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between mb-8 px-2 relative",
          !isOpen && "px-0 justify-center",
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="min-w-8 min-h-8 w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm transform rotate-45 flex items-center justify-center">
              <span className="text-[10px] text-white -rotate-45 font-bold">
                I
              </span>
            </div>
          </div>
          {isOpen && (
            <span className="font-bold tracking-tight whitespace-nowrap">Equarix Dashboard</span>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className={cn(
            "text-zinc-500 hover:text-white min-w-8 w-8 h-8 rounded-full border border-zinc-800 bg-[#121212] shadow-sm z-10",
            !isOpen && "absolute right-[-28px] top-0",
          )}
          onPress={() => setIsOpen(!isOpen)}
        >
          <LuChevronsLeft
            size={16}
            className={cn(
              "transition-transform duration-300",
              !isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* User Profile */}
      <div
        className={cn(
          "flex items-center gap-3 mb-8 px-2 relative w-full",
          !isOpen && "px-0 justify-center",
        )}
      >
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          className="min-w-10 h-10 text-large"
        />
        {isOpen && (
          <div className="w-full flex items-center justify-between overflow-hidden">
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-sm font-semibold">
                {user?.username}
              </span>
              <span className="text-xs text-zinc-500">
                {user?.role}
              </span>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={toggleTheme}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              {theme === "dark" ? <LuSun size={18} /> : <LuMoon size={18} />}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollShadow className="flex-1 -mx-2 px-2 overflow-x-hidden">
        <nav className="flex flex-col gap-1">
          {SideBarConfig.body.map((item) => (
            <SidebarItem key={item.href} {...item} isOpen={isOpen} />
          ))}
        </nav>
      </ScrollShadow>

      {/* Footer */}
      <div className="mt-auto pt-4 flex flex-col gap-1 overflow-x-hidden">
        {SideBarConfig.footer.map((item) => (
          <SidebarItem key={item.href} {...item} isOpen={isOpen} />
        ))}
        <button
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-danger dark:hover:text-danger",
            !isOpen && "justify-center px-0",
          )}
          onClick={() => {
            logout();
          }}
        >
          <HiOutlineMinusCircle size={22} className="min-w-[22px]" />
          {isOpen && (
            <span className="font-semibold text-sm whitespace-nowrap">Cerrar sesión</span>
          )}
        </button>
      </div>
    </aside>
  );
}
