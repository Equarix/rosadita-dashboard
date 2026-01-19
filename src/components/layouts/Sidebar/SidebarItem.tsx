import { cn } from "@heroui/react";
import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
} from "react";
import { LuChevronDown } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export interface SidebarItemProps {
  icon: ReactElement<{ size?: number; strokeWidth?: number }>;
  label: string;
  badge?: string | number;
  href: string;
  children: SidebarItemProps[];
}

export function SidebarItem({
  icon: Icon,
  label,
  badge,
  href,
  children,
}: SidebarItemProps) {
  const { pathname } = useLocation();
  const Component = children.length > 0 ? "div" : Link;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <Component
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors cursor-pointer group",
          pathname === href
            ? "bg-white text-black"
            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white",
        )}
        to={href}
        onClick={() => {
          if (children.length > 0) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-3">
          {isValidElement(Icon) &&
            cloneElement(Icon, {
              size: 20,
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
                  : "bg-zinc-800 text-zinc-400 uppercase tracking-wider",
              )}
            >
              {badge}
            </span>
          )}
          {children.length > 0 && (
            <LuChevronDown
              size={16}
              className={cn(
                "text-zinc-500 transition-all group-hover:text-zinc-300",
                isOpen && "rotate-180",
              )}
            />
          )}
        </div>
      </Component>

      <AnimatePresence>
        {isOpen && children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col pl-4 border-l overflow-hidden border-zinc-800"
          >
            {children.map((child) => (
              <SidebarItem key={child.href} {...child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
