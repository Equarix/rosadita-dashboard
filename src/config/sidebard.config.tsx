import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import { LuGrid2X2Plus, LuHouse } from "react-icons/lu";
import { RxGithubLogo } from "react-icons/rx";

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
      children: [],
    },
    {
      label: "Blog",
      href: "",
      icon: <RxGithubLogo />,
      children: [
        {
          href: "/blog",
          icon: <RxGithubLogo />,
          label: "Listar Posts",
          children: [],
        },
        {
          href: "/blog/categories",
          icon: <LuGrid2X2Plus />,
          label: "Categorías",
          children: [],
        },
      ],
    },
  ],
  footer: [],
};
