import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  ApiResponse,
  CrmCategoryResponse,
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
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  LuArrowLeft,
  LuBuilding2,
  LuClock,
  LuGlobe,
  LuMapPin,
  LuPlus,
  LuSave,
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

export default function CreateEnterprisePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fetch Categories for dropdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<
    ApiResponse<CrmCategoryResponse[]>
  >({
    queryKey: ["crm-categories"],
    queryFn: async () => {
      const res = await instance.get("/crm-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const categories = categoriesData?.body || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateEnterpriseSchema),
    defaultValues: {
      name: "",
      address: "",
      street: "",
      phone: "",
      reviewCount: 0,
      stars: 5,
      urlGoogleMaps: "",
      lat: "",
      lng: "",
      website: "",
      schedules: [{ day: "lunes", hours: "8:00 a.m. - 6:00 p.m." }],
      categoryId: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const selectedCategory = watch("categoryId");

  // POST Mutation to create enterprise
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateEnterpriseInput) => {
      const res = await instance.post("/crm", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Empresa creada exitosamente",
        color: "success",
      });
      navigate("/crm");
    },
    onError: () => {
      addToast({
        title: "Error al crear la empresa",
        color: "danger",
      });
    },
  });

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto p-4 pb-12">
      <Load loading={isPending} />

      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="flat"
            radius="full"
            size="sm"
            onPress={() => navigate("/crm")}
          >
            <LuArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Crear Nueva Empresa
            </h1>
            <p className="text-xs text-default-500">
              Registra los datos de la empresa para el seguimiento CRM
            </p>
          </div>
        </div>

        <Button
          color="primary"
          className="font-semibold flex items-center gap-1.5 shadow-sm"
          type="submit"
          form="create-enterprise-form"
          isLoading={isPending}
        >
          <LuSave className="size-4" />
          Guardar Empresa
        </Button>
      </div>

      <form
        id="create-enterprise-form"
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-5"
      >
        {/* Section 1: Información General */}
        <Card shadow="sm" className="border border-default-200/80">
          <CardHeader className="flex items-center gap-2 text-primary font-bold pb-2">
            <LuBuilding2 className="size-5" />
            <span>Información Principal</span>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-0">
            <Input
              label="Nombre de la Empresa"
              placeholder="Ej. Ferretería Leon"
              {...register("name")}
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
              labelPlacement="outside-top"
              className="sm:col-span-2"
            />

            <Select
              label="Categoría"
              placeholder="Seleccionar categoría"
              errorMessage={errors.categoryId?.message}
              isInvalid={!!errors.categoryId}
              labelPlacement="outside-top"
              isLoading={isLoadingCategories}
              selectedKeys={
                selectedCategory ? [selectedCategory.toString()] : []
              }
              onChange={(e) => setValue("categoryId", Number(e.target.value))}
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

            <Input
              label="Teléfono"
              placeholder="Ej. 946 403 995"
              {...register("phone")}
              errorMessage={errors.phone?.message}
              isInvalid={!!errors.phone}
              labelPlacement="outside-top"
            />
          </CardBody>
        </Card>

        {/* Section 2: Ubicación */}
        <Card shadow="sm" className="border border-default-200/80">
          <CardHeader className="flex items-center gap-2 text-primary font-bold pb-2">
            <LuMapPin className="size-5" />
            <span>Ubicación y Google Maps</span>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-0">
            <Input
              label="Dirección Completa"
              placeholder="Ej. Av. España 551, Trujillo"
              {...register("address")}
              errorMessage={errors.address?.message}
              isInvalid={!!errors.address}
              labelPlacement="outside-top"
              className="sm:col-span-2"
            />

            <Input
              label="Calle / Referencia"
              placeholder="Ej. Av. España 551"
              {...register("street")}
              errorMessage={errors.street?.message}
              isInvalid={!!errors.street}
              labelPlacement="outside-top"
            />

            <Input
              label="URL Google Maps"
              placeholder="https://maps.google.com/?cid=..."
              {...register("urlGoogleMaps")}
              errorMessage={errors.urlGoogleMaps?.message}
              isInvalid={!!errors.urlGoogleMaps}
              labelPlacement="outside-top"
              className="sm:col-span-3"
            />

            <Input
              label="Latitud"
              placeholder="-8.1100026"
              {...register("lat")}
              errorMessage={errors.lat?.message}
              isInvalid={!!errors.lat}
              labelPlacement="outside-top"
            />

            <Input
              label="Longitud"
              placeholder="-79.0324522"
              {...register("lng")}
              errorMessage={errors.lng?.message}
              isInvalid={!!errors.lng}
              labelPlacement="outside-top"
            />
          </CardBody>
        </Card>

        {/* Section 3: Reputación y Web */}
        <Card shadow="sm" className="border border-default-200/80">
          <CardHeader className="flex items-center gap-2 text-primary font-bold pb-2">
            <LuGlobe className="size-5" />
            <span>Reputación y Sitio Web</span>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-0">
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              label="Calificación (Estrellas 0.0 - 5.0)"
              placeholder="5.0"
              startContent={
                <LuStar className="size-4 fill-amber-400 text-amber-400" />
              }
              {...register("stars")}
              errorMessage={errors.stars?.message}
              isInvalid={!!errors.stars}
              labelPlacement="outside-top"
            />

            <Input
              type="number"
              min="0"
              label="Número de Reseñas"
              placeholder="10"
              {...register("reviewCount")}
              errorMessage={errors.reviewCount?.message}
              isInvalid={!!errors.reviewCount}
              labelPlacement="outside-top"
            />

            <Input
              label="Sitio Web (Opcional)"
              placeholder="https://..."
              {...register("website")}
              errorMessage={errors.website?.message}
              isInvalid={!!errors.website}
              labelPlacement="outside-top"
            />
          </CardBody>
        </Card>

        {/* Section 4: Horarios de Atención */}
        <Card shadow="sm" className="border border-default-200/80">
          <CardHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2 text-primary font-bold">
              <LuClock className="size-5" />
              <span>Horarios de Atención</span>
            </div>

            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() =>
                append({ day: "lunes", hours: "8:00 a.m. - 6:00 p.m." })
              }
              className="font-semibold flex items-center gap-1"
            >
              <LuPlus className="size-4" />
              Agregar Día
            </Button>
          </CardHeader>

          <CardBody className="flex flex-col gap-3 pt-0">
            {fields.length === 0 ? (
              <p className="text-xs text-default-400 italic py-2">
                No has agregado horarios de atención.
              </p>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-default-50 border border-default-200/70"
                >
                  <Select
                    placeholder="Día"
                    {...register(`schedules.${index}.day` as const)}
                    size="sm"
                    className="w-40"
                    aria-label="Seleccionar día"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <SelectItem key={d} textValue={d} className="capitalize">
                        <span className="capitalize">{d}</span>
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    placeholder="Horario (Ej. 8:00 a.m. - 6:00 p.m. o Cerrado)"
                    {...register(`schedules.${index}.hours` as const)}
                    size="sm"
                    className="flex-1"
                    aria-label="Ingresar horario"
                  />

                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={() => remove(index)}
                  >
                    <LuTrash className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="flat"
            color="default"
            onPress={() => navigate("/crm")}
          >
            Cancelar
          </Button>

          <Button
            color="primary"
            className="font-semibold flex items-center gap-1.5 shadow-sm"
            type="submit"
            isLoading={isPending}
          >
            <LuSave className="size-4" />
            Guardar Empresa
          </Button>
        </div>
      </form>
    </div>
  );
}
