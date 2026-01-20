import { useAuth } from "@/components/providers/AuthContext";
import Table from "@/components/ui/table/Table";
import type { ApiResponse, ResponseUser } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import CreateUser from "@/module/user/create-user/CreateUser";
import DeleteUser from "@/module/user/delete-user/DeleteUser";
import EditUser from "@/module/user/edit-user/EditUser";
import { Button, Tooltip, useDisclosure } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";

export default function UserPage() {
  const { token } = useAuth();
  const { data, isLoading, refetch } = useQuery<ApiResponse<ResponseUser[]>>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await instance.get("/auth/all-users", {
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
    user: null as null | ResponseUser,
  });

  return (
    <div className="flex flex-col gap-2 w-full h-full text-white">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
          onPress={onOpen}
        >
          <LuPlus />
          Nueva Usuario
        </Button>
      </header>

      <Table
        data={data?.body || []}
        columns={[
          {
            header: "ID",
            accessorKey: "userId",
          },
          {
            header: "Nombre Completo",
            accessorKey: "fullName",
          },
          {
            header: "Nombre de Usuario",
            accessorKey: "username",
          },
          {
            header: "Rol",
            accessorKey: "role",
          },
          {
            header: "Creado En",
            accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
          },
          {
            header: "Acciones",
            cell: ({ row }) => (
              <div className="flex items-center gap-2">
                <Tooltip content="Eliminar usuario" color="danger">
                  <Button
                    color="danger"
                    isIconOnly
                    onPress={() => {
                      setIsOpenMutate({
                        type: "delete",
                        user: row.original,
                      });
                    }}
                  >
                    <LuTrash />
                  </Button>
                </Tooltip>

                <Tooltip content="Editar usuario" color="primary">
                  <Button
                    color="primary"
                    isIconOnly
                    onPress={() => {
                      setIsOpenMutate({
                        type: "edit",
                        user: row.original,
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
        isLoading={isLoading}
      />

      <CreateUser
        isOpen={isOpen}
        onClose={onOpenChange}
        onSuccess={() => refetch()}
      />

      {isOpenMutate.type === "edit" && isOpenMutate.user && (
        <EditUser
          isOpen={isOpenMutate.type === "edit"}
          onClose={() =>
            setIsOpenMutate({
              type: "",
              user: null,
            })
          }
          user={isOpenMutate.user!}
          onSuccess={refetch}
        />
      )}

      {isOpenMutate.type === "delete" && isOpenMutate.user && (
        <DeleteUser
          isOpen={isOpenMutate.type === "delete"}
          onClose={() =>
            setIsOpenMutate({
              type: "",
              user: null,
            })
          }
          userId={isOpenMutate.user.userId}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
