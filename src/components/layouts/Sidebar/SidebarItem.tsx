import { cn } from "@heroui/react";
import { cloneElement, isValidElement, type ReactElement } from "react";
import { LuPlus } from "react-icons/lu";
import { Link, useLocation } from "react-router";
export interface SidebarItemProps {
  icon: ReactElement<{ size?: number; strokeWidth?: number }>;
  label: string;
  badge?: string | number;
  hasPlus?: boolean;
  href: string;
}

export function SidebarItem({
  icon: Icon,
  label,
  badge,
  hasPlus,
  href,
}: SidebarItemProps) {
  const { pathname } = useLocation();

  return (
    <Link
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors cursor-pointer group",
        pathname === href
          ? "bg-white text-black"
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
      )}
      to={href}
    >
      <div className="flex items-center gap-3">
        {isValidElement(Icon) &&
          cloneElement(Icon, {
            size: 20,
            strokeWidth: pathname === href ? 2.5 : 2,
          })}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
              typeof badge === "number"
                ? "bg-zinc-800 text-zinc-400 w-5 h-5 flex items-center justify-center"
                : "bg-zinc-800 text-zinc-400 uppercase tracking-wider"
            )}
          >
            {badge}
          </span>
        )}
        {hasPlus && (
          <LuPlus
            size={16}
            className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
          />
        )}
      </div>
    </Link>
  );
}
