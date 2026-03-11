import ProjectCategoriesPage from "@/pages/project/categories/ProjectCategoriesPage";
import CreateProjectPage from "@/pages/project/create/CreateProjectPage";
import EditProjectPage from "@/pages/project/edit/EditProjectPage";
import ProjectListPage from "@/pages/project/list/ProjectListPage";
import { Route, Routes } from "react-router";

export default function ProjectRoute() {
  return (
    <Routes>
      <Route path="/" element={<ProjectListPage />} />
      <Route path="/crear" element={<CreateProjectPage />} />
      <Route path="/editar/:projectId" element={<EditProjectPage />} />
      <Route path="/categories" element={<ProjectCategoriesPage />} />
    </Routes>
  );
}
