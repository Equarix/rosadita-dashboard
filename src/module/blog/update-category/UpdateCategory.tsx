import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  CategoryResponse,
  ColorType,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  CategoryBlogSchema,
  type CategoryBlogInput,
} from "@/schemas/blog/categorie-blog.schema";
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

interface CreateCategoryProps {
  onClose?: () => void;
  isOpen?: boolean;
  onSuccess?: () => void;
  category: CategoryResponse;
}

export default function UpdateCategory({
  onClose,
  isOpen,
  onSuccess,
  category,
}: CreateCategoryProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(CategoryBlogSchema),
    defaultValues: {
      name: category.name,
      color: category.color as ColorType,
      description: category.description,
    },
  });

  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CategoryBlogInput) => {
      const res = await instance.patch(
        `/categories/${category.categoryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría actualizada",
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
              Actualizar categoría
            </ModalHeader>
            <form onSubmit={handleSubmit((values) => mutate(values))}>
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
                      shouldDirty: true,
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
                  Actualizar categoría
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
