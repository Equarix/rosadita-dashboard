import { useAuth } from "@/components/providers/AuthContext";
import Table from "@/components/ui/table/Table";
import type { ApiResponse, ResponseProject } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, Chip, Tooltip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function ProjectListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ApiResponse<ResponseProject[]>>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await instance.get("/projects", {
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
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
          onPress={() => navigate("/project/crear")}
        >
          <LuPlus />
          Nuevo Proyecto
        </Button>
      </header>

      <Table
        data={data?.body || []}
        isLoading={isLoading}
        columns={[
          {
            header: "Nombre",
            accessorKey: "projectName",
          },
          {
            header: "Slug",
            accessorKey: "projectSlug",
          },
          {
            header: "Categoría",
            accessorKey: "category.name",
            cell: ({
              row: {
                original: { category },
              },
            }) => <span>{category?.name || "Sin categoría"}</span>,
          },
          {
            header: "Estado",
            cell: ({
              row: {
                original: { status },
              },
            }) => (
              <Chip
                color={status ? "success" : "danger"}
                size="sm"
                className="text-white font-semibold"
              >
                {status ? "Activo" : "Inactivo"}
              </Chip>
            ),
          },
          {
            header: "Acciones",
            cell: ({ row }) => (
              <div className="flex items-center gap-2">
                <Tooltip content="Eliminar proyecto" color="danger">
                  <Button color="danger" isIconOnly>
                    <LuTrash />
                  </Button>
                </Tooltip>

                <Tooltip content="Editar proyecto" color="primary">
                  <Button
                    color="primary"
                    isIconOnly
                    onPress={() =>
                      navigate(`/project/editar/${row.original.projectId}`)
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
