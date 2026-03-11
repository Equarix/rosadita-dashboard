import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type { ColorType } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  CategoryProjectSchema,
  type CategoryProjectInput,
} from "@/schemas/project/categorie-project.schema";
import { cn } from "@/utils/cn";
import { listColor } from "@/utils/listColor";
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
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface CreateCategoryProjectProps {
  onClose?: () => void;
  isOpen?: boolean;
  onSuccess?: () => void;
}

export default function CreateCategoryProject({
  onClose,
  isOpen,
  onSuccess,
}: CreateCategoryProjectProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(CategoryProjectSchema),
  });

  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CategoryProjectInput) => {
      const res = await instance.post("/categories-project", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría de proyecto creada",
        color: "success",
      });
      reset();
      onClose?.();
      onSuccess?.();
    },
    onError: () => {
      addToast({
        title: "Error al crear la categoría",
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
            <ModalHeader className="flex flex-col gap-1">
              Crear categoría de proyecto
            </ModalHeader>
            <form onSubmit={handleSubmit((values) => mutate(values as CategoryProjectInput))}>
              <ModalBody>
                <Input
                  label="Nombre"
                  {...register("name")}
                  errorMessage={errors.name?.message}
                  labelPlacement="outside-top"
                />
                <Select
                  label="Color"
                  errorMessage={errors.color?.message}
                  labelPlacement="outside-top"
                  items={listColor}
                  selectedKeys={watch("color") ? [watch("color")] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as ColorType;
                    setValue("color", value, {
                      shouldValidate: true,
                    });
                  }}
                >
                  {(color) => (
                    <SelectItem key={color.value} textValue={color.label}>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(`size-4 inline-block`, color.className)}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  )}
                </Select>

                <Textarea
                  label="Descripción"
                  {...register("description")}
                  errorMessage={errors.description?.message}
                  labelPlacement="outside-top"
                  classNames={{
                    input: "py-2",
                  }}
                />
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
                  Crear categoría
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
