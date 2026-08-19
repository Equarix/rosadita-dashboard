import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import {
  LuGrid2X2Plus,
  LuHouse,
  LuMail,
  LuPackagePlus,
  LuPlus,
  LuUser,
} from "react-icons/lu";
import { TbPhoto } from "react-icons/tb";
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
    {
      label: "Proyectos",
      href: "",
      icon: <LuGrid2X2Plus />,
      children: [
        {
          href: "/project",
          icon: <LuGrid2X2Plus />,
          label: "Listar Proyectos",
          children: [],
        },
        {
          href: "/project/categories",
          icon: <LuGrid2X2Plus />,
          label: "Categorías",
          children: [],
        },
      ],
    },
    {
      label: "CRM",
      href: "",
      icon: <LuPackagePlus />,
      children: [
        {
          href: "/crm",
          icon: <LuPackagePlus />,
          label: "Empresas",
          children: [
            {
              href: "/crm",
              icon: <LuPackagePlus />,
              label: "Listar Empresas",
              children: [],
            },
            {
              href: "/crm/crear",
              icon: <LuPlus />,
              label: "Crear Empresa",
              children: [],
            },
          ],
        },
        {
          href: "/crm/categories",
          icon: <LuGrid2X2Plus />,
          label: "Categorias",
          children: [],
        },
      ],
    },
    {
      label: "Clientes",
      href: "",
      icon: <LuUser />,
      children: [
        {
          href: "/client",
          icon: <LuGrid2X2Plus />,
          label: "Listar Clientes",
          children: [],
        },
      ],
    },
    {
      href: "/galery",
      icon: <TbPhoto />,
      label: "Galería",
      children: [],
    },
    {
      href: "/contact",
      icon: <LuMail />,
      label: "Contactos",
      children: [],
    },
    {
      href: "/users",
      icon: <LuUser />,
      label: "Usuarios",
      children: [],
      roles: ["admin"],
    },
  ],
  footer: [],
};
