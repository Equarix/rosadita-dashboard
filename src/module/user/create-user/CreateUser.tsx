import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import { instance } from "@/libs/axios";
import { UserSchema, type CreateUserInput } from "@/schemas/user/user.schema";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface CreateUserProps {
  onClose?: () => void;
  isOpen?: boolean;
  onSuccess?: () => void;
}

export default function CreateUser({
  onClose,
  isOpen,
  onSuccess,
}: CreateUserProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(UserSchema),
  });
  const { token } = useAuth();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const res = await instance.post("/auth/register", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },

    onSuccess: () => {
      addToast({
        title: "Usuario creado",
        color: "success",
      });

      onSuccess?.();
      onClose?.();
    },

    onError: () => {
      addToast({
        title: "Error al crear el usuario",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Load loading={isPending} />
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Crear Usuario</ModalHeader>

            <form onSubmit={handleSubmit((data) => mutate(data))}>
              <ModalBody>
                <Input
                  label="Nombre Completo"
                  required
                  {...register("fullName")}
                  errorMessage={errors.fullName?.message?.toString()}
                  labelPlacement="outside-top"
                />
                <Input
                  label="Nombre de Usuario"
                  required
                  {...register("username")}
                  errorMessage={errors.username?.message?.toString()}
                  labelPlacement="outside-top"
                />
                <Input
                  label="Contraseña"
                  type="password"
                  required
                  {...register("password")}
                  errorMessage={errors.password?.message?.toString()}
                  labelPlacement="outside-top"
                />

                <Select
                  label="Rol"
                  required
                  labelPlacement="outside-top"
                  value={watch("role")}
                  items={[
                    {
                      label: "Usuario",
                      value: "user",
                    },
                    {
                      label: "Administrador",
                      value: "admin",
                    },
                  ]}
                  onChange={(e) => {
                    setValue("role", e.target.value as CreateUserInput["role"]);
                  }}
                >
                  {(role) => (
                    <SelectItem key={role.value} textValue={role.label}>
                      {role.label}
                    </SelectItem>
                  )}
                </Select>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  type="button"
                >
                  Cancelar
                </Button>

                <Button color="primary" type="submit">
                  Crear Usuario
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
