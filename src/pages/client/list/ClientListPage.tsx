import { useAuth } from "@/components/providers/AuthContext";
import Table from "@/components/ui/table/Table";
import type {
  ApiResponse,
  ClientResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, Chip, Tooltip, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function ClientListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ApiResponse<ClientResponse[]>>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await instance.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full h-full text-white">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
          onPress={() => navigate("/client/crear")}
        >
          <LuPlus />
          Nuevo Cliente
        </Button>
      </header>

      <Table
        data={data?.body || []}
        isLoading={isLoading}
        columns={[
          {
            header: "Nombre",
            accessorKey: "name",
          },
          {
            header: "Imagen",
            cell: ({
              row: {
                original: { url },
              },
            }) => (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                <Image
                  src={url}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ),
          },
          {
            header: "Destacado",
            cell: ({
              row: {
                original: { feature },
              },
            }) => (
              <Chip
                color={feature ? "warning" : "default"}
                size="sm"
                className="text-white font-semibold"
              >
                {feature ? "Sí" : "No"}
              </Chip>
            ),
          },
          {
            header: "Estado",
            cell: ({
              row: {
                original: { isActive },
              },
            }) => (
              <Chip
                color={isActive ? "success" : "danger"}
                size="sm"
                className="text-white font-semibold"
              >
                {isActive ? "Activo" : "Inactivo"}
              </Chip>
            ),
          },
          {
            header: "Acciones",
            cell: ({ row }) => (
              <div className="flex items-center gap-2">
                <Tooltip content="Eliminar cliente" color="danger">
                  <Button color="danger" isIconOnly>
                    <LuTrash />
                  </Button>
                </Tooltip>

                <Tooltip content="Editar cliente" color="primary">
                  <Button
                    color="primary"
                    isIconOnly
                    onPress={() =>
                      navigate(`/client/editar/${row.original.clientId}`)
                    }
                  >
                    <LuPen />
                  </Button>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
