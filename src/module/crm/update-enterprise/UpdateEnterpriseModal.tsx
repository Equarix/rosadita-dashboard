import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  ApiResponse,
  CrmCategoryResponse,
  EnterpriseResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  CreateEnterpriseSchema,
  type CreateEnterpriseInput,
} from "@/schemas/crm/create-enterprise.schema";
import { RenderLuIcon } from "@/utils/iconHelper";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import {
  LuBuilding2,
  LuClock,
  LuGlobe,
  LuMapPin,
  LuPlus,
  LuStar,
  LuTrash,
} from "react-icons/lu";

const DAYS_OF_WEEK = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

interface UpdateEnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  enterprise: EnterpriseResponse | null;
}

export default function UpdateEnterpriseModal({
  isOpen,
  onClose,
  onSuccess,
  enterprise,
}: UpdateEnterpriseModalProps) {
  const { token } = useAuth();

  // Fetch Categories for dropdown
  const { data: categoriesData } = useQuery<ApiResponse<CrmCategoryResponse[]>>(
    {
      queryKey: ["crm-categories"],
      queryFn: async () => {
        const res = await instance.get("/crm-categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      },
      enabled: isOpen && !!token,
    },
  );

  const categories = categoriesData?.body || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateEnterpriseSchema),
    defaultValues: {
      name: "",
      address: "",
      street: "",
      phone: "",
      reviewCount: 0,
      stars: 0,
      urlGoogleMaps: "",
      lat: "",
      lng: "",
      website: "",
      categoryId: undefined,
      schedules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  useEffect(() => {
    if (enterprise) {
      reset({
        name: enterprise.name || "",
        address: enterprise.address || "",
        street: enterprise.street || "",
        phone: enterprise.phone || "",
        reviewCount: enterprise.reviewCount || 0,
        stars: enterprise.stars || 0,
        urlGoogleMaps: enterprise.urlGoogleMaps || "",
        lat: enterprise.lat || "",
        lng: enterprise.lng || "",
        website: enterprise.website || "",
        categoryId: enterprise.category?.categoryEnterpriseId || undefined,
        schedules: enterprise.schedules || [],
      });
    }
  }, [enterprise, reset]);

  const selectedCategory = watch("categoryId");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateEnterpriseInput) => {
      if (!enterprise) throw new Error("Empresa no seleccionada");
      const res = await instance.patch(
        `/crm/${enterprise.enterpriseId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Empresa actualizada exitosamente",
        color: "success",
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      addToast({
        title: "Error al actualizar la empresa",
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
              <div className="flex items-center gap-2 text-primary font-bold text-lg">
                <LuBuilding2 className="size-5" />
                <span>Editar Empresa</span>
              </div>
            </ModalHeader>

            <ModalBody>
              <form
                id="update-enterprise-form"
                onSubmit={handleSubmit((values) => mutate(values))}
                className="flex flex-col gap-5"
              >
                {/* Información Principal */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Información Básica
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre de la empresa"
                      placeholder="Ej. MiFarma"
                      {...register("name")}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      labelPlacement="outside-top"
                    />

                    <Select
                      label="Categoría"
                      placeholder="Selecciona una categoría"
                      selectedKeys={
                        selectedCategory ? [selectedCategory.toString()] : []
                      }
                      onChange={(e) =>
                        setValue("categoryId", Number(e.target.value))
                      }
                      errorMessage={errors.categoryId?.message}
                      isInvalid={!!errors.categoryId}
                      labelPlacement="outside-top"
                    >
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.categoryEnterpriseId.toString()}
                          textValue={cat.name}
                        >
                          <div className="flex items-center gap-2">
                            <RenderLuIcon
                              name={cat.icon}
                              className="size-4 text-primary"
                            />
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Teléfono / Contacto"
                      placeholder="Ej. +51 987654321"
                      {...register("phone")}
                      errorMessage={errors.phone?.message}
                      isInvalid={!!errors.phone}
                      labelPlacement="outside-top"
                    />

                    <Input
                      label="Sitio Web"
                      placeholder="Ej. https://mifarma.com.pe"
                      {...register("website")}
                      errorMessage={errors.website?.message}
                      isInvalid={!!errors.website}
                      labelPlacement="outside-top"
                      startContent={
                        <LuGlobe className="size-4 text-default-400" />
                      }
                    />
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex flex-col gap-3 pt-2 border-t border-default-200">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <LuMapPin className="size-4" /> Ubicación & Dirección
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Dirección completa"
                      placeholder="Ej. Av. Larco 123, Miraflores"
                      {...register("address")}
                      errorMessage={errors.address?.message}
                      isInvalid={!!errors.address}
                      labelPlacement="outside-top"
                    />

                    <Input
                      label="Calle / Referencia"
                      placeholder="Ej. Av. Larco"
                      {...register("street")}
                      errorMessage={errors.street?.message}
                      isInvalid={!!errors.street}
                      labelPlacement="outside-top"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="URL Google Maps"
                      placeholder="Ej. https://maps.google.com/..."
                      {...register("urlGoogleMaps")}
                      errorMessage={errors.urlGoogleMaps?.message}
                      isInvalid={!!errors.urlGoogleMaps}
                      labelPlacement="outside-top"
                    />

                    <Input
                      label="Latitud"
                      placeholder="Ej. -12.121"
                      {...register("lat")}
                      errorMessage={errors.lat?.message}
                      isInvalid={!!errors.lat}
                      labelPlacement="outside-top"
                    />

                    <Input
                      label="Longitud"
                      placeholder="Ej. -77.030"
                      {...register("lng")}
                      errorMessage={errors.lng?.message}
                      isInvalid={!!errors.lng}
                      labelPlacement="outside-top"
                    />
                  </div>
                </div>

                {/* Reseñas y Calificación */}
                <div className="flex flex-col gap-3 pt-2 border-t border-default-200">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <LuStar className="size-4" /> Calificación
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      label="Estrellas (0 - 5)"
                      placeholder="Ej. 4.5"
                      {...register("stars")}
                      errorMessage={errors.stars?.message}
                      isInvalid={!!errors.stars}
                      labelPlacement="outside-top"
                    />

                    <Input
                      type="number"
                      label="Cantidad de Reseñas"
                      placeholder="Ej. 120"
                      {...register("reviewCount")}
                      errorMessage={errors.reviewCount?.message}
                      isInvalid={!!errors.reviewCount}
                      labelPlacement="outside-top"
                    />
                  </div>
                </div>

                {/* Horarios de Atención */}
                <div className="flex flex-col gap-3 pt-2 border-t border-default-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <LuClock className="size-4" /> Horarios de Atención
                    </span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() =>
                        append({ day: "lunes", hours: "08:00 - 20:00" })
                      }
                      className="font-medium"
                    >
                      <LuPlus className="size-4" /> Agregar Día
                    </Button>
                  </div>

                  {fields.map((field, index) => {
                    const currentDay = watch(`schedules.${index}.day`);
                    return (
                      <div
                        key={field.id}
                        className="flex items-center gap-3 bg-default-50 p-2.5 rounded-xl border border-default-200"
                      >
                        <div className="w-44">
                          <Select
                            size="sm"
                            aria-label="Seleccionar día"
                            selectedKeys={currentDay ? [String(currentDay)] : []}
                            onChange={(e) =>
                              setValue(`schedules.${index}.day`, e.target.value)
                            }
                          >
                            {DAYS_OF_WEEK.map((d) => (
                              <SelectItem key={d} textValue={d}>
                                {d.charAt(0).toUpperCase() + d.slice(1)}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        <div className="flex-1">
                          <Input
                            size="sm"
                            placeholder="Ej. 08:00 - 20:00 o Cerrado"
                            {...register(`schedules.${index}.hours`)}
                          />
                        </div>

                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => remove(index)}
                        >
                          <LuTrash className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                form="update-enterprise-form"
              >
                Guardar Cambios
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
