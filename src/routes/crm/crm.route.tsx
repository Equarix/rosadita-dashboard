import CrmCategoriesPage from "@/pages/crm/categories/CrmCategoriesPage";
import CreateEnterprisePage from "@/pages/crm/create/CreateEnterprisePage";
import CrmListPage from "@/pages/crm/list/CrmListPage";
import { Route, Routes } from "react-router";

export default function CrmRoute() {
  return (
    <Routes>
      <Route path="/" element={<CrmListPage />} />
      <Route path="crear" element={<CreateEnterprisePage />} />
      <Route path="categories" element={<CrmCategoriesPage />} />
    </Routes>
  );
}


