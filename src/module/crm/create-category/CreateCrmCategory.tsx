import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import TiptapEditor from "@/components/shared/editor/TiptapEditor";
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
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuMessageSquare } from "react-icons/lu";

interface CreateCrmCategoryProps {
  onClose?: () => void;
  isOpen?: boolean;
  onSuccess?: () => void;
}

export default function CreateCrmCategory({
  onClose,
  isOpen,
  onSuccess,
}: CreateCrmCategoryProps) {
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
      name: "",
      icon: "LuPill",
      speach: "",
    },
  });

  const { token } = useAuth();
  const selectedIcon = watch("icon");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CrmCategoryInput) => {
      const payload = {
        ...data,
        speach,
      };
      const res = await instance.post("/crm-categories", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría CRM creada exitosamente",
        color: "success",
      });
      reset();
      setSpeach("");
      onClose?.();
      onSuccess?.();
    },
    onError: () => {
      addToast({
        title: "Error al crear la categoría CRM",
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
              Crear Categoría CRM
            </ModalHeader>
            <ModalBody>
              <form id="create-crm-category-form" onSubmit={handleSubmit((values) => mutate(values))} className="flex flex-col gap-4">
                <Input
                  label="Nombre de la categoría"
                  placeholder="Ej. Farmacia, Servicios, etc."
                  {...register("name")}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  labelPlacement="outside-top"
                />

                <Select
                  label="Ícono"
                  placeholder="Selecciona un ícono"
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

              <Button color="primary" type="submit" form="create-crm-category-form">
                Crear categoría
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
