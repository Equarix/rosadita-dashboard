import { Route, Routes } from "react-router";
import BlogRoute from "../blog/blog.route";
import GaleryPage from "@/pages/galery/GaleryPage";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="blog/*" element={<BlogRoute />} />
      <Route path="galery" element={<GaleryPage />} />
    </Routes>
  );
}
