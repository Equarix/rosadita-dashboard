import { useAuth } from "@/components/providers/AuthContext";
import type {
  ApiResponse,
  CrmCategoryResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import AlertDeleteCrmCategory from "@/module/crm/alert-delete-category/AlertDeleteCrmCategory";
import CreateCrmCategory from "@/module/crm/create-category/CreateCrmCategory";
import UpdateCrmCategory from "@/module/crm/update-category/UpdateCrmCategory";
import { RenderLuIcon } from "@/utils/iconHelper";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuCalendar, LuPen, LuPlus, LuSearch, LuTag, LuTrash } from "react-icons/lu";

export default function CrmCategoriesPage() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery<
    ApiResponse<CrmCategoryResponse[]>
  >({
    queryKey: ["crm-categories"],
    queryFn: async () => {
      const res = await instance.get("/crm-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpenMutate, setIsOpenMutate] = useState<{
    type: "delete" | "edit" | "";
    category: CrmCategoryResponse | null;
  }>({
    type: "",
    category: null,
  });

  const categories = data?.body || [];

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full h-full p-0">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías CRM</h1>
          <p className="text-sm text-default-500">
            Gestión de categorías para las empresas del CRM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar categoría..."
            value={search}
            onValueChange={setSearch}
            startContent={<LuSearch className="text-default-400 size-4" />}
            isClearable
            className="w-full sm:w-64"
            size="sm"
            radius="lg"
          />
          <Button
            color="primary"
            className="font-semibold flex items-center gap-1.5 shrink-0"
            onPress={onOpen}
          >
            <LuPlus className="size-5" />
            Nueva Categoría
          </Button>
        </div>
      </header>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" color="primary" />
          <p className="text-sm text-default-400 font-medium">Cargando categorías...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-default-200 rounded-2xl bg-default-50/50">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-3">
            <LuTag className="size-8" />
          </div>
          <h3 className="text-lg font-semibold">No se encontraron categorías</h3>
          <p className="text-sm text-default-500 text-center max-w-sm mt-1 mb-4">
            {search
              ? "No hay resultados para la búsqueda ingresada."
              : "Comienza creando la primera categoría para organizar las empresas."}
          </p>
          {!search && (
            <Button
              color="primary"
              variant="flat"
              onPress={onOpen}
              startContent={<LuPlus />}
              className="font-semibold"
            >
              Crear Categoría
            </Button>
          )}
        </div>
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <Card
              key={category.categoryEnterpriseId}
              shadow="sm"
              className="border border-default-200/80 hover:border-primary/50 transition-all duration-200 hover:shadow-md group"
            >
              <CardHeader className="flex items-start justify-between gap-3 pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200 shadow-sm">
                    <RenderLuIcon name={category.icon} className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-xs text-default-400 font-mono">
                      ID: #{category.categoryEnterpriseId}
                    </span>
                  </div>
                </div>

                <Chip
                  color={category.status ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                  className="font-semibold capitalize shrink-0"
                >
                  {category.status ? "Activo" : "Inactivo"}
                </Chip>
              </CardHeader>

              <CardBody className="py-2 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-default-500 bg-default-100 dark:bg-default-50/50 p-2 rounded-lg">
                  <span className="font-semibold text-default-600">Ícono:</span>
                  <code className="bg-background px-1.5 py-0.5 rounded text-primary font-mono text-[11px]">
                    {category.icon}
                  </code>
                </div>
              </CardBody>

              <CardFooter className="pt-2 border-t border-default-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-default-400">
                  <LuCalendar className="size-3.5" />
                  <span>
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip content="Editar categoría" color="primary">
                    <Button
                      color="primary"
                      variant="flat"
                      isIconOnly
                      size="sm"
                      radius="lg"
                      onPress={() => {
                        setIsOpenMutate({
                          type: "edit",
                          category,
                        });
                      }}
                    >
                      <LuPen className="size-4" />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Eliminar categoría" color="danger">
                    <Button
                      color="danger"
                      variant="flat"
                      isIconOnly
                      size="sm"
                      radius="lg"
                      onPress={() => {
                        setIsOpenMutate({
                          type: "delete",
                          category,
                        });
                      }}
                    >
                      <LuTrash className="size-4" />
                    </Button>
                  </Tooltip>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modales */}
      <CreateCrmCategory
        isOpen={isOpen}
        onClose={onOpenChange}
        onSuccess={refetch}
      />

      {isOpenMutate.type === "edit" && isOpenMutate.category && (
        <UpdateCrmCategory
          isOpen={isOpenMutate.type === "edit"}
          onClose={() =>
            setIsOpenMutate({
              type: "",
              category: null,
            })
          }
          category={isOpenMutate.category}
          onSuccess={refetch}
        />
      )}

      {isOpenMutate.type === "delete" && isOpenMutate.category && (
        <AlertDeleteCrmCategory
          isOpen={isOpenMutate.type === "delete"}
          onClose={() =>
            setIsOpenMutate({
              type: "",
              category: null,
            })
          }
          categoryId={isOpenMutate.category.categoryEnterpriseId}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
