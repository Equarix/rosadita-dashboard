import Categorias from "@/pages/categorias/Categorias";
import { Route, Routes } from "react-router";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="/categorias" element={<Categorias />} />
    </Routes>
  );
}
