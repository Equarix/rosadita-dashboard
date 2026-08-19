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
import { LuTriangleAlert } from "react-icons/lu";

interface AlertDeleteTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trackingId: number | null;
}

export default function AlertDeleteTrackingModal({
  isOpen,
  onClose,
  onSuccess,
  trackingId,
}: AlertDeleteTrackingModalProps) {
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!trackingId) throw new Error("ID de seguimiento inválido");
      const res = await instance.delete(`/crm/tracking/${trackingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Seguimiento eliminado exitosamente",
        color: "success",
      });
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      addToast({
        title: error.message || "Error al eliminar el seguimiento",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 text-danger">
              <LuTriangleAlert className="size-5" />
              <span>Eliminar Seguimiento</span>
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-default-600">
                ¿Estás seguro de que deseas eliminar este registro de seguimiento? Esta acción no se puede deshacer.
              </p>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancelar
              </Button>

              <Button
                color="danger"
                className="font-semibold"
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
