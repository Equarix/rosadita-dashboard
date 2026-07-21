import { Route, Routes } from "react-router";
import ClientListPage from "@/pages/client/list/ClientListPage";
import CreateClientPage from "@/pages/client/create/CreateClientPage";
import EditClientPage from "@/pages/client/edit/EditClientPage";

export default function ClientRoute() {
  return (
    <Routes>
      <Route path="/" element={<ClientListPage />} />
      <Route path="crear" element={<CreateClientPage />} />
      <Route path="editar/:id" element={<EditClientPage />} />
    </Routes>
  );
}
