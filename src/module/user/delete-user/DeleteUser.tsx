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

interface DeleteUserProps {
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  userId: number;
}

export default function DeleteUser({
  onClose,
  isOpen,
  userId,
  onSuccess,
}: DeleteUserProps) {
  const { token } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await instance.delete(`/auth/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Usuario eliminado",
        color: "success",
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      addToast({
        title: "Error al eliminar el usuario",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Eliminar Usuario</ModalHeader>

            <ModalBody>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no
              se puede deshacer.
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={() => mutate()}
                isLoading={isPending}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
