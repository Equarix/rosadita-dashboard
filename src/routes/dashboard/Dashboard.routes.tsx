import { Route, Routes } from "react-router";
import BlogRoute from "../blog/blog.route";
import GaleryPage from "@/pages/galery/GaleryPage";
import AdminRoute from "@/components/shared/admin-route/AdminRoute";
import UserPage from "@/pages/user/UserPage";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Inicio dashboard</h1>} />
      <Route path="blog/*" element={<BlogRoute />} />
      <Route path="galery" element={<GaleryPage />} />
      <Route
        path="users"
        element={
          <AdminRoute>
            <UserPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
