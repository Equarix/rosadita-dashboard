import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import { LuHouse } from "react-icons/lu";

interface SideBarConfigProps {
  body: SidebarItemProps[];
  footer: SidebarItemProps[];
}

export const SideBarConfig: SideBarConfigProps = {
  body: [
    {
      href: "/",
      icon: <LuHouse />,
      label: "Inicio",
    },
  ],
  footer: [],
};
