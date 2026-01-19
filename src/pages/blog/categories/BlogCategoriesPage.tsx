import { useAuth } from "@/components/providers/AuthContext";
import Table from "@/components/ui/table/Table";
import type {
  ApiResponse,
  CategoryResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import AlertDeleteCategory from "@/module/blog/alert-delete-category/AlertDeleteCategory";
import CreateCategory from "@/module/blog/create-category/CreateCategory";
import UpdateCategory from "@/module/blog/update-category/UpdateCategory";
import { getColorClass } from "@/utils/getColor";
import { Button, Chip, cn, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";

export default function BlogCategoriesPage() {
  const { token } = useAuth();

  const { data, isLoading, refetch } = useQuery<
    ApiResponse<CategoryResponse[]>
  >({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const res = await instance.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpenMutate, setIsOpenMutate] = useState({
    type: "" as "delete" | "edit" | "",
    category: null as null | CategoryResponse,
  });

  return (
    <div className="flex flex-col gap-2 w-full h-full text-white">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Categorías del Blog</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
          onPress={onOpen}
        >
          <LuPlus />
          Nueva Categoría
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
            header: "Descripción",
            accessorKey: "description",
          },
          {
            header: "Slug",
            accessorKey: "slug",
          },
          {
            header: "Color",
            cell: ({
              row: {
                original: { color },
              },
            }) => {
              const parseColor = getColorClass(color);
              return <span className={cn("size-4 block", parseColor)}></span>;
            },
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
            cell: ({
              row: {
                original: { categoryId, ...category },
              },
            }) => (
              <div className="flex items-center gap-2">
                <Tooltip content="Eliminar categoría" color="danger">
                  <Button
                    color="danger"
                    isIconOnly
                    onPress={() => {
                      setIsOpenMutate({
                        type: "delete",
                        category: {
                          categoryId,
                          ...category,
                        },
                      });
                    }}
                  >
                    <LuTrash />
                  </Button>
                </Tooltip>

                <Tooltip content="Editar categoría" color="primary">
                  <Button
                    color="primary"
                    isIconOnly
                    onPress={() => {
                      setIsOpenMutate({
                        type: "edit",
                        category: {
                          categoryId,
                          ...category,
                        },
                      });
                    }}
                  >
                    <LuPen />
                  </Button>
                </Tooltip>
              </div>
            ),
          },
        ]}
      />

      <CreateCategory
        isOpen={isOpen}
        onClose={onOpenChange}
        onSuccess={refetch}
      />

      {isOpenMutate.type === "edit" && isOpenMutate.category && (
        <UpdateCategory
          isOpen={isOpenMutate.type === "edit"}
          onClose={() =>
            setIsOpenMutate({
              type: "",
              category: null,
            })
          }
          category={isOpenMutate.category!}
          onSuccess={refetch}
        />
      )}

      <AlertDeleteCategory
        isOpen={isOpenMutate.type === "delete"}
        onClose={() =>
          setIsOpenMutate({
            type: "",
            category: null,
          })
        }
        categoryId={isOpenMutate.category?.categoryId || -1}
        onSuccess={refetch}
      />
    </div>
  );
}
