import type { ColorType } from "@/interface/response.interface";

export function getColorClass(color: string) {
  const colorMap: Record<ColorType, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
  };

  return colorMap[color.toLocaleLowerCase() as ColorType] || "bg-gray-500";
}
