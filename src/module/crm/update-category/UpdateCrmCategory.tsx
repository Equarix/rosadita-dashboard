import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import TiptapEditor from "@/components/shared/editor/TiptapEditor";
import type { CrmCategoryResponse } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  CrmCategorySchema,
  type CrmCategoryInput,
} from "@/schemas/crm/crm-category.schema";
import { crmIconList, RenderLuIcon } from "@/utils/iconHelper";
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
  Switch,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LuMessageSquare } from "react-icons/lu";

interface UpdateCrmCategoryProps {
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  category: CrmCategoryResponse;
}

export default function UpdateCrmCategory({
  onClose,
  isOpen,
  onSuccess,
  category,
}: UpdateCrmCategoryProps) {
  const [speach, setSpeach] = useState<string>("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CrmCategoryInput>({
    resolver: zodResolver(CrmCategorySchema),
    defaultValues: {
      name: category.name,
      icon: category.icon,
      status: category.status,
      speach: category.speach || "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon,
        status: category.status,
        speach: category.speach || "",
      });
      setSpeach(category.speach || "");
    }
  }, [category, reset]);

  const { token } = useAuth();
  const selectedIcon = watch("icon");
  const currentStatus = watch("status");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CrmCategoryInput) => {
      const payload = {
        ...data,
        speach,
      };
      const res = await instance.patch(
        `/crm-categories/${category.categoryEnterpriseId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría CRM actualizada",
        color: "success",
      });
      onClose();
      onSuccess();
    },
    onError: () => {
      addToast({
        title: "Error al actualizar la categoría",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl" scrollBehavior="inside">
      <Load loading={isPending} />

      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Editar Categoría CRM
            </ModalHeader>
            <ModalBody>
              <form id="update-crm-category-form" onSubmit={handleSubmit((values) => mutate(values))} className="flex flex-col gap-4">
                <Input
                  label="Nombre de la categoría"
                  {...register("name")}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  labelPlacement="outside-top"
                />

                <Select
                  label="Ícono"
                  errorMessage={errors.icon?.message}
                  isInvalid={!!errors.icon}
                  labelPlacement="outside-top"
                  items={crmIconList}
                  selectedKeys={selectedIcon ? [selectedIcon] : []}
                  onChange={(e) => {
                    setValue("icon", e.target.value);
                  }}
                  startContent={<RenderLuIcon name={selectedIcon} className="size-5 text-primary" />}
                >
                  {(item) => (
                    <SelectItem key={item.value} textValue={item.label}>
                      <div className="flex items-center gap-2">
                        <RenderLuIcon name={item.value} className="size-4" />
                        <span>{item.label}</span>
                      </div>
                    </SelectItem>
                  )}
                </Select>

                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <LuMessageSquare className="size-4 text-primary" />
                    <span>Speach de la categoría</span>
                  </div>
                  <TiptapEditor
                    content={speach}
                    onChange={(html) => setSpeach(html)}
                    outputFormat="html"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">Estado de la categoría</span>
                  <Switch
                    isSelected={currentStatus ?? true}
                    onValueChange={(val) => setValue("status", val)}
                    color="success"
                  >
                    {currentStatus ? "Activo" : "Inactivo"}
                  </Switch>
                </div>
              </form>
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

              <Button color="primary" type="submit" form="update-crm-category-form">
                Guardar Cambios
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
