import { useAuth } from "@/components/providers/AuthContext";
import { instance } from "@/libs/axios";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

interface AlertDeleteCategoryProps {
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  categoryId: number;
}

export default function AlertDeleteCategory({
  onClose,
  isOpen,
  categoryId,
  onSuccess,
}: AlertDeleteCategoryProps) {
  const { token } = useAuth();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Categoría eliminada",
        color: "success",
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      addToast({
        title: "Error al eliminar la categoría",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Eliminar Categoría</ModalHeader>

            <ModalBody>
              ¿Estás seguro de que deseas eliminar esta categoría? Esta acción
              no se puede deshacer.
            </ModalBody>

            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={() => mutate()}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
