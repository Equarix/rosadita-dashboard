import React from "react";
import * as LuIcons from "react-icons/lu";

export interface IconOption {
  value: string;
  label: string;
}

export const crmIconList: IconOption[] = [
  { value: "LuPill", label: "LuPill (Farmacia)" },
  { value: "LuBuilding", label: "LuBuilding (Empresa / Edificio)" },
  { value: "LuStore", label: "LuStore (Tienda / Comercio)" },
  { value: "LuShoppingBag", label: "LuShoppingBag (Ventas / Retail)" },
  { value: "LuHospital", label: "LuHospital (Salud / Clínica)" },
  { value: "LuBriefcase", label: "LuBriefcase (Servicios / Negocios)" },
  { value: "LuPackage", label: "LuPackage (Productos / Logística)" },
  { value: "LuBoxes", label: "LuBoxes (Inventario / Depósito)" },
  { value: "LuFactory", label: "LuFactory (Industria / Manufactura)" },
  { value: "LuUtensils", label: "LuUtensils (Gastronomía)" },
  { value: "LuTruck", label: "LuTruck (Transporte)" },
  { value: "LuSparkles", label: "LuSparkles (Belleza / Estética)" },
  { value: "LuWrench", label: "LuWrench (Mantenimiento / Técnico)" },
  { value: "LuGraduationCap", label: "LuGraduationCap (Educación)" },
  { value: "LuHeartPulse", label: "LuHeartPulse (Salud)" },
  { value: "LuActivity", label: "LuActivity (Actividad / Servicios)" },
  { value: "LuLayers", label: "LuLayers (Multisector)" },
  { value: "LuFolder", label: "LuFolder (Varios)" },
  { value: "LuTag", label: "LuTag (Etiqueta)" },
  { value: "LuGrid2X2Plus", label: "LuGrid2X2Plus (Categoría)" },
];

export function RenderLuIcon({
  name,
  className = "size-5",
}: {
  name?: string;
  className?: string;
}) {
  if (!name) return <LuIcons.LuTag className={className} />;
  
  const IconComponent =
    (LuIcons as Record<string, React.ElementType>)[name] || LuIcons.LuTag;

  return <IconComponent className={className} />;
}
