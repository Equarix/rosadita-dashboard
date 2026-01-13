import { Avatar, Button, ScrollShadow } from "@heroui/react";
import { LuChevronsLeft } from "react-icons/lu";
import { SideBarConfig } from "@/config/sidebard.config";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "@/components/providers/AuthContext";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-72 h-screen bg-[#121212] border-r border-zinc-800 flex flex-col p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm transform rotate-45 flex items-center justify-center">
              <span className="text-[10px] text-white -rotate-45 font-bold">
                I
              </span>
            </div>
          </div>
          <span className="font-bold tracking-tight">Equarix Dashboard</span>
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="text-zinc-500 min-w-unit-8 w-8 h-8 rounded-full border border-zinc-800"
        >
          <LuChevronsLeft size={16} />
        </Button>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          className="w-10 h-10 text-large"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{user?.username}</span>
          <span className="text-xs text-zinc-500">{user?.role}</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollShadow className="flex-1 -mx-2 px-2">
        <nav className="flex flex-col gap-1">
          {SideBarConfig.body.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </nav>
      </ScrollShadow>

      {/* Footer */}
      <div className="mt-auto pt-4 flex flex-col gap-1">
        {SideBarConfig.footer.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </div>
    </aside>
  );
}
