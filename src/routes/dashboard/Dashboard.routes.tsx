import { Route, Routes } from "react-router";
import BlogRoute from "../blog/blog.route";
import ProjectRoute from "../project/project.route";
import ClientRoute from "./Client.routes";
import GaleryPage from "@/pages/galery/GaleryPage";
import ContactPage from "@/pages/contact/ContactPage";
import AdminRoute from "@/components/shared/admin-route/AdminRoute";
import UserPage from "@/pages/user/UserPage";
import Home from "@/pages/home";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="blog/*" element={<BlogRoute />} />
      <Route path="project/*" element={<ProjectRoute />} />
      <Route path="client/*" element={<ClientRoute />} />
      <Route path="contact" element={<ContactPage />} />
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
