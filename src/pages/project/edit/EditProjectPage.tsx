import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  ApiResponse,
  CategoryResponseProyect,
  ImageResponse,
  ResponseProject,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import ComponentGalleryModal from "@/module/blog/component-gallery/ComponentGalleryModal";
import ImageGalleryModal from "@/module/blog/image-gallery/ImageGalleryModal";
import { ProjectSchema, type ProjectInput } from "@/schemas/project/project.schema";
import {
  addToast,
  Button,
  Image,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { LuImage, LuTrash } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableProjectComponentForm } from "@/pages/project/create/components/SortableProjectComponentForm";
import { cn } from "@/utils/cn";

export default function EditProjectPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isImgGalleryOpen,
    onOpen: onImgGalleryOpen,
    onOpenChange: onImgGalleryOpenChange,
  } = useDisclosure();
  const [selectedHeroImage, setSelectedHeroImage] =
    useState<ImageResponse | null>(null);

  const methods = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      components: [],
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
    reset,
  } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "components",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const { data: projectData, isLoading: isLoadingProject } = useQuery<
    ApiResponse<ResponseProject>
  >({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await instance.get(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!projectId,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<
    ApiResponse<CategoryResponseProyect[]>
  >({
    queryKey: ["project-categories"],
    queryFn: async () => {
      const res = await instance.get("/categories-project", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (projectData?.body) {
      const project = projectData.body;
      reset({
        projectName: project.projectName,
        categoryId: project.category?.category_proyectId,
        imageId: project.image?.imageId,
        description: project.description,
        components: project.components as any,
      });

      if (project.image) {
        setSelectedHeroImage(project.image);
      }
    }
  }, [projectData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProjectInput) => {
      const res = await instance.patch(`/projects/${projectId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Proyecto actualizado",
        color: "success",
      });
      navigate("/project");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el proyecto",
        color: "danger",
      });
    },
  });

  const handleAddComponent = (type: string, defaultValues: unknown) => {
    append({
      type: type as unknown,
      ...(defaultValues as Record<string, unknown>),
    } as any);
  };

  const handleImageSelect = (image: ImageResponse) => {
    setValue("imageId", image.imageId, { shouldValidate: true });
    setSelectedHeroImage(image);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full text-white pb-10">
      <Load loading={isPending || isLoadingCategories || isLoadingProject} />

      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Editar Proyecto</h1>
      </header>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((values) => mutate(values as ProjectInput))}
          className="flex flex-col gap-4 bg-default-50 p-6 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Proyecto"
              {...register("projectName")}
              errorMessage={errors.projectName?.message}
              labelPlacement="outside"
              placeholder="Ingrese el nombre"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { value, onChange, name } }) => (
                <div>
                  <Select
                    label="Categoría"
                    labelPlacement="outside"
                    placeholder="Seleccione tipo"
                    className={cn(!!errors.categoryId && "mt-0!")}
                    items={categoriesData?.body || []}
                    selectedKeys={
                      value !== undefined && value !== null
                        ? new Set([String(value)])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey) {
                        onChange(Number(selectedKey));
                      }
                    }}
                    name={name}
                  >
                    {(item) => (
                      <SelectItem key={String(item.category_proyectId)}>
                        {item.name}
                      </SelectItem>
                    )}
                  </Select>
                </div>
              )}
            />

            <div className="flex flex-col gap-2">
              <span className="text-small font-medium text-foreground">
                Imagen Principal
              </span>
              {selectedHeroImage ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary group bg-default-100">
                  <Image
                    src={selectedHeroImage.url}
                    alt="Project Image"
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full object-cover",
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      onPress={onImgGalleryOpen}
                    >
                      <LuImage size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      onPress={() => {
                        setValue("imageId", 0, { shouldValidate: true });
                        setSelectedHeroImage(null);
                      }}
                    >
                      <LuTrash size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-[3.5rem] border-2 border-dashed border-default-300 rounded-lg flex items-center justify-center gap-2 text-default-400 cursor-pointer hover:border-primary hover:text-primary transition-colors bg-default-50"
                  onClick={onImgGalleryOpen}
                >
                  <LuImage size={20} />
                  <span>Seleccionar Imagen</span>
                </div>
              )}
              {errors.imageId?.message && (
                <span className="text-tiny text-danger">
                  {errors.imageId?.message}
                </span>
              )}
            </div>
          </div>

          <Textarea
            label="Descripción"
            {...register("description")}
            errorMessage={errors.description?.message}
            labelPlacement="outside"
            placeholder="Descripción del proyecto"
            minRows={4}
          />

          <div className="border-t border-default-200 pt-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Componentes</h2>
              <Button variant="solid" color="primary" onPress={onOpen}>
                Agregar Componente
              </Button>
            </div>

            <ComponentGalleryModal
              isOpen={isOpen}
              onClose={onOpenChange}
              onSelect={handleAddComponent}
            />

            <ImageGalleryModal
              isOpen={isImgGalleryOpen}
              onClose={onImgGalleryOpenChange}
              onSelect={handleImageSelect}
            />

            <div className="flex flex-col gap-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field, index) => (
                    <SortableProjectComponentForm
                      key={field.id}
                      id={field.id}
                      index={index}
                      remove={remove}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {fields.length === 0 && (
                <p className="text-default-400 text-center py-4">
                  No hay componentes agregados
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-default-50 py-4 border-t border-default-100 z-10">
            <Button
              color="danger"
              variant="light"
              onPress={() => navigate("/project")}
              type="button"
            >
              Cancelar
            </Button>

            <Button color="primary" type="submit">
              Actualizar Proyecto
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
