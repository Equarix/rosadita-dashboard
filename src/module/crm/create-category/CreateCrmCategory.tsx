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
  Card,
  CardBody,
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
import { useFieldArray, useForm } from "react-hook-form";
import { LuMessageSquare, LuPlus, LuTrash2 } from "react-icons/lu";

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
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(CrmCategorySchema),
    defaultValues: {
      name: "",
      icon: "LuPill",
      speaches: [{ name: "", speach: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "speaches",
  });

  const { token } = useAuth();
  const selectedIcon = watch("icon");
  const speachesWatch = watch("speaches");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CrmCategoryInput) => {
      const res = await instance.post("/crm-categories", data, {
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
      reset({
        name: "",
        icon: "LuPill",
        speaches: [{ name: "", speach: "" }],
      });
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
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <Load loading={isPending} />

      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Crear Categoría CRM
            </ModalHeader>
            <ModalBody>
              <form
                id="create-crm-category-form"
                onSubmit={handleSubmit((values: CrmCategoryInput) =>
                  mutate(values),
                )}
                className="flex flex-col gap-4"
              >
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
                  startContent={
                    <RenderLuIcon
                      name={selectedIcon}
                      className="size-5 text-primary"
                    />
                  }
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

                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <LuMessageSquare className="size-4 text-primary" />
                      <span>Speaches / Guiones ({fields.length})</span>
                    </div>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<LuPlus className="size-4" />}
                      onPress={() => append({ name: "", speach: "" })}
                    >
                      Agregar Speach
                    </Button>
                  </div>

                  {errors.speaches?.root?.message && (
                    <p className="text-xs text-danger font-medium">
                      {errors.speaches.root.message}
                    </p>
                  )}

                  <div className="flex flex-col gap-4">
                    {fields.length === 0 ? (
                      <p className="text-xs text-foreground-400 italic text-center py-2">
                        No hay speaches agregados. Haz clic en "Agregar Speach"
                        para añadir uno.
                      </p>
                    ) : (
                      fields.map((field, index) => (
                        <Card
                          key={field.id}
                          className="border border-default-200 shadow-none"
                        >
                          <CardBody className="flex flex-col gap-3 p-4">
                            <div className="flex items-center justify-between gap-2">
                              <Input
                                label={`Nombre del Speach #${index + 1}`}
                                placeholder="Ej. Saludo inicial, Cierre de venta..."
                                {...register(`speaches.${index}.name`)}
                                errorMessage={
                                  errors.speaches?.[index]?.name?.message
                                }
                                isInvalid={!!errors.speaches?.[index]?.name}
                                size="sm"
                              />
                              <Button
                                isIconOnly
                                color="danger"
                                variant="light"
                                size="sm"
                                className="mt-4"
                                onPress={() => remove(index)}
                              >
                                <LuTrash2 className="size-4" />
                              </Button>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-medium text-foreground-600">
                                Contenido del Speach
                              </span>
                              <TiptapEditor
                                content={speachesWatch?.[index]?.speach || ""}
                                onChange={(html) =>
                                  setValue(`speaches.${index}.speach`, html, {
                                    shouldValidate: true,
                                  })
                                }
                                outputFormat="html"
                              />
                              {errors.speaches?.[index]?.speach?.message && (
                                <p className="text-xs text-danger">
                                  {errors.speaches[index].speach.message}
                                </p>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      ))
                    )}
                  </div>
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

              <Button
                color="primary"
                type="submit"
                form="create-crm-category-form"
              >
                Crear categoría
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
