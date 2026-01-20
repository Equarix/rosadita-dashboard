import { useAuth } from "@/components/providers/AuthContext";
import Table from "@/components/ui/table/Table";
import type { ApiResponse, ResponseBlog } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, Chip, Tooltip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function BlogListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ApiResponse<ResponseBlog[]>>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await instance.get("/blogs", {
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
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
          onPress={() => navigate("/blog/crear")}
        >
          <LuPlus />
          Nuevo Blog
        </Button>
      </header>

      <Table
        data={data?.body || []}
        isLoading={isLoading}
        columns={[
          {
            header: "Nombre",
            accessorKey: "blogName",
          },
          {
            header: "Slug",
            accessorKey: "blogSlug",
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
                <Tooltip content="Eliminar blog" color="danger">
                  <Button color="danger" isIconOnly>
                    <LuTrash />
                  </Button>
                </Tooltip>

                <Tooltip content="Editar blog" color="primary">
                  <Button
                    color="primary"
                    isIconOnly
                    onPress={() =>
                      navigate(`/blog/editar/${row.original.blogId}`)
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
