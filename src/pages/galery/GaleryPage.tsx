import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  ApiResponse,
  ImageResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  Button,
  Card,
  Image,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  addToast,
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuCopy, LuUpload, LuImage } from "react-icons/lu";
import { useState, useRef } from "react";

export default function GaleryPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading, data } = useQuery<ApiResponse<ImageResponse[]>>({
    queryKey: ["galery-images"],
    queryFn: async () => {
      const res = await instance.get("/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await instance.post<ApiResponse<ImageResponse>>(
        "/images",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Imagen subida correctamente",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["galery-images"] });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      addToast({
        title: "Error al subir imagen",
        color: "danger",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (onClose: () => void) => {
    if (!file) return;
    await uploadMutation.mutateAsync(file);
    onClose();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({
      title: "URL copiada al portapapeles",
      color: "success",
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full text-white">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Imágenes de la Galería</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
          onPress={onOpen}
        >
          <LuPlus />
          Nueva Imagen
        </Button>
      </header>

      <Load loading={isLoading} />
      <section className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {data?.body.map((u) => (
          <Card isFooterBlurred className="border-none group relative overflow-hidden" radius="lg" key={u._id}>
            <Image
              src={u.url}
              classNames={{
                wrapper: "w-full aspect-square",
                img: "w-full h-full object-cover",
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
              <Button
                color="primary"
                variant="solid"
                className="font-semibold flex items-center gap-2"
                onPress={() => copyToClipboard(u.url)}
              >
                <LuCopy size={18} />
                Copiar URL
              </Button>
            </div>
          </Card>
        ))}
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Subir Nueva Imagen
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-6 min-h-[300px] border-2 border-dashed border-default-300 rounded-lg bg-default-50 p-6">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {!file ? (
                    <>
                      <div className="p-4 rounded-full bg-default-100 text-default-500">
                        <LuUpload size={48} />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">Click para seleccionar</p>
                        <p className="text-sm text-default-400">SVG, PNG, JPG or GIF</p>
                      </div>
                      <Button
                        color="primary"
                        onPress={() => fileInputRef.current?.click()}
                      >
                        Seleccionar Archivo
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-primary/10 text-primary">
                        <LuImage size={48} />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">
                          {file.name}
                        </p>
                        <p className="text-sm text-default-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={() => {
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleUpload(onClose)}
                  isDisabled={!file}
                  isLoading={uploadMutation.isPending}
                >
                  Subir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
