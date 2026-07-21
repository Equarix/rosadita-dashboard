import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type { ImageResponse } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import ImageGalleryModal from "@/module/blog/image-gallery/ImageGalleryModal";
import {
  ClientSchema,
  type ClientInput,
} from "@/schemas/client/client.schema";
import {
  addToast,
  Button,
  Image,
  Input,
  useDisclosure,
  Checkbox,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
} from "react-hook-form";
import { LuImage, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";

export default function CreateClientPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    isOpen: isImgGalleryOpen,
    onOpen: onImgGalleryOpen,
    onOpenChange: onImgGalleryOpenChange,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<ImageResponse | null>(null);

  const methods = useForm({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: "",
      url: "",
      feature: false,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    control,
  } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ClientInput) => {
      const res = await instance.post("/clients", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Cliente creado",
        color: "success",
      });
      navigate("/client");
    },
    onError: () => {
      addToast({
        title: "Error al crear el cliente",
        color: "danger",
      });
    },
  });

  const handleImageSelect = (image: ImageResponse) => {
    setValue("url", image.url, { shouldValidate: true });
    setSelectedImage(image);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full text-white pb-10">
      <Load loading={isPending} />

      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Crear Nuevo Cliente</h1>
      </header>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((values) => mutate(values as ClientInput))}
          className="flex flex-col gap-4 bg-default-50 p-6 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <Input
                label="Nombre del Cliente"
                {...register("name")}
                errorMessage={errors.name?.message}
                labelPlacement="outside"
                placeholder="Ingrese el nombre"
              />

              <div className="flex gap-4 mt-2">
                <Controller
                  control={control}
                  name="feature"
                  render={({ field: { value, onChange, name } }) => (
                    <Checkbox
                      isSelected={value}
                      onValueChange={onChange}
                      name={name}
                    >
                      ¿Destacado?
                    </Checkbox>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 row-span-2">
              <span className="text-small font-medium text-foreground">
                Imagen del Cliente (URL)
              </span>
              {errors.url && (
                <span className="text-danger text-tiny">{errors.url.message}</span>
              )}
              {selectedImage ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary group bg-default-100 flex items-center justify-center p-4">
                  <Image
                    src={selectedImage.url}
                    alt="Client Image"
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full object-contain",
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
                        setValue("url", "", { shouldValidate: true });
                        setSelectedImage(null);
                      }}
                    >
                      <LuTrash size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-[8rem] border-2 border-dashed border-default-300 rounded-lg flex items-center justify-center gap-2 text-default-400 cursor-pointer hover:border-primary hover:text-primary transition-colors bg-default-50"
                  onClick={onImgGalleryOpen}
                >
                  <LuImage size={24} />
                  <span>Seleccionar de la galería</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="danger"
              variant="flat"
              onPress={() => navigate("/client")}
            >
              Cancelar
            </Button>
            <Button color="primary" type="submit" isLoading={isPending}>
              Crear Cliente
            </Button>
          </div>
        </form>
      </FormProvider>

      <ImageGalleryModal
        isOpen={isImgGalleryOpen}
        onClose={onImgGalleryOpenChange}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
