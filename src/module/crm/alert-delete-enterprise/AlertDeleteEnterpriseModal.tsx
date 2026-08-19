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

interface AlertDeleteEnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  enterpriseId: number | null;
  enterpriseName?: string;
}

export default function AlertDeleteEnterpriseModal({
  isOpen,
  onClose,
  onSuccess,
  enterpriseId,
  enterpriseName,
}: AlertDeleteEnterpriseModalProps) {
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!enterpriseId) throw new Error("ID de empresa inválido");
      const res = await instance.delete(`/crm/${enterpriseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Empresa eliminada exitosamente",
        color: "success",
      });
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      addToast({
        title: error.message || "Error al eliminar la empresa",
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
              <span>Eliminar Empresa</span>
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-default-600">
                ¿Estás seguro de que deseas eliminar la empresa{" "}
                {enterpriseName ? (
                  <strong className="text-foreground">{enterpriseName}</strong>
                ) : (
                  "seleccionada"
                )}
                ? Esta acción no se puede deshacer.
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
