import { useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  ApiResponse,
  CrmCategoryResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { RenderLuIcon } from "@/utils/iconHelper";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LuFileSpreadsheet, LuCloudUpload, LuX } from "react-icons/lu";

interface UploadEnterprisesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadEnterprisesModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadEnterprisesModalProps) {
  const { token } = useAuth();
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

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
    enabled: isOpen,
  });

  const categories = categoriesData?.body || [];

  // POST Mutation for file upload
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!idCategoria) throw new Error("Debes seleccionar una categoría");
      if (!file) throw new Error("Debes seleccionar un archivo CSV");

      const formData = new FormData();
      formData.append("idCategoria", idCategoria);
      formData.append("file", file);

      const res = await instance.post("/crm/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Carga masiva realizada con éxito",
        color: "success",
      });
      setIdCategoria("");
      setFile(null);
      onClose();
      onSuccess();
    },
    onError: (error: Error) => {
      addToast({
        title: error.message || "Error al realizar la carga masiva",
        color: "danger",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setIdCategoria("");
    setFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleReset} size="lg">
      <Load loading={isPending} />
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary font-bold text-lg">
                <LuCloudUpload className="size-6" />
                <span>Carga Masiva de Empresas</span>
              </div>
              <p className="text-xs text-default-500 font-normal">
                Sube un archivo CSV con el listado de empresas asignándole una categoría.
              </p>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-4 py-2">
              {/* Category Selector */}
              <Select
                label="Categoría destino"
                placeholder="Selecciona la categoría"
                labelPlacement="outside-top"
                isLoading={isLoadingCategories}
                selectedKeys={idCategoria ? [idCategoria] : []}
                onChange={(e) => setIdCategoria(e.target.value)}
                isRequired
              >
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.categoryEnterpriseId.toString()}
                    textValue={cat.name}
                  >
                    <div className="flex items-center gap-2">
                      <RenderLuIcon name={cat.icon} className="size-4 text-primary" />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>

              {/* File Input Dropzone */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">
                  Archivo CSV <span className="text-danger">*</span>
                </span>

                <div className="relative border-2 border-dashed border-default-300 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-default-50/50 hover:bg-primary-50/20 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                  {file ? (
                    <div className="flex items-center gap-3 bg-background p-3 rounded-xl border border-default-200 shadow-sm w-full">
                      <LuFileSpreadsheet className="size-8 text-success shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-default-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                      >
                        <LuX className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <LuCloudUpload className="size-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                          Haz clic para seleccionar o arrastra tu archivo CSV
                        </p>
                        <p className="text-xs text-default-400 mt-0.5">
                          Formato soportado: .csv
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={handleReset}
                type="button"
              >
                Cancelar
              </Button>

              <Button
                color="primary"
                className="font-semibold"
                onPress={() => mutate()}
                isDisabled={!idCategoria || !file}
                isLoading={isPending}
              >
                Subir Empresas
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
