import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type { ResponseUser } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  UserSchema,
  type CreateUserInput,
  EditUserSchema,
  type EditUserInput,
} from "@/schemas/user/user.schema";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditUserProps {
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  user: ResponseUser;
}

export default function EditUser({
  onClose,
  isOpen,
  onSuccess,
  user,
}: EditUserProps) {
  // Use schema but make password optional if not changing?
  // Or just reuse CreateUserInput but ignore password if empty?
  // Let's assume standard UserSchema for now, ideally we use a specific EditUserSchema
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      fullName: user.fullName,
      username: user.username,
      role: user.role as "admin" | "user",
      password: "", // Password usually empty on edit, handled by backend if present
    },
  });

  const { token } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      reset({
        fullName: user.fullName,
        username: user.username,
        role: user.role as "admin" | "user",
        password: "",
      });
    }
  }, [isOpen, user, reset]);

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: EditUserInput) => {
      // If password is empty, maybe don't send it? Or backend handles it?
      // For now sending as is.
      const res = await instance.patch(`/auth/edit/${user.userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },

    onSuccess: () => {
      addToast({
        title: "Usuario actualizado",
        color: "success",
      });

      onSuccess?.();
      onClose?.();
    },

    onError: () => {
      addToast({
        title: "Error al actualizar el usuario",
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
            <ModalHeader>Editar Usuario</ModalHeader>

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
                {/* Password field might be tricky if schema requires it. 
                     If UserSchema requires password, we must provide it or create a separate schema.
                     Assuming for now we can provide a new password to change it, 
                     or if specific logic is needed the user will tell us. 
                     If UserSchema enforces min length, this might block updates without password change. 
                  */}
                <Input
                  label="Nueva Contraseña (Opcional)"
                  type="password"
                  {...register("password")}
                  errorMessage={errors.password?.message?.toString()}
                  labelPlacement="outside-top"
                  description="Dejar en blanco para mantener la actual"
                />

                <Select
                  label="Rol"
                  required
                  labelPlacement="outside-top"
                  selectedKeys={watch("role") ? [watch("role")] : []}
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
                    setValue("role", e.target.value as EditUserInput["role"]);
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
                  Actualizar Usuario
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
