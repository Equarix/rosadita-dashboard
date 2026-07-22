import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type { ApiResponse, ContactResponse } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  addToast,
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuTrash2, LuEye } from "react-icons/lu";
import { useState } from "react";

const CONTACT_STATUS_OPTIONS = [
  { key: "pending", label: "Pendiente", color: "warning" as const },
  { key: "read", label: "Leído", color: "primary" as const },
  { key: "responded", label: "Respondido", color: "success" as const },
  { key: "resolved", label: "Resuelto", color: "default" as const },
  { key: "rejected", label: "Rechazado", color: "danger" as const },
];

export default function ContactPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null);

  const { isLoading, data } = useQuery<ApiResponse<ContactResponse[]>>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await instance.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await instance.put(
        `/contact/${id}`,
        { contactStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      addToast({ title: "Estado actualizado", color: "success" });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      addToast({ title: "Error al actualizar estado", color: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await instance.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({ title: "Contacto eliminado", color: "success" });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      addToast({ title: "Error al eliminar contacto", color: "danger" });
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este contacto?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (contact: ContactResponse) => {
    setSelectedContact(contact);
    onOpen();
  };

  const getStatusColor = (statusKey: string) => {
    const opt = CONTACT_STATUS_OPTIONS.find((o) => o.key === statusKey);
    return opt?.color || "default";
  };

  const contacts = data?.body || [];

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Contactos</h1>
      </header>

      <Load loading={isLoading} />

      {!isLoading && (
        <Table aria-label="Tabla de contactos">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>EMAIL / TELÉFONO</TableColumn>
            <TableColumn>ASUNTO / MENSAJE</TableColumn>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn align="center">ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay contactos registrados.">
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>
                  <p className="font-semibold">{contact.fullName}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{contact.email}</p>
                  <p className="text-xs text-default-500">{contact.phone}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{contact.assunto}</p>
                  <p className="text-xs text-default-500 max-w-xs truncate" title={contact.message}>
                    {contact.message}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{new Date(contact.createdAt).toLocaleDateString()}</p>
                </TableCell>
                <TableCell>
                  <Select
                    aria-label="Estado del contacto"
                    selectedKeys={[contact.contactStatus]}
                    size="sm"
                    className="w-32"
                    onChange={(e) => handleStatusChange(contact.contactId.toString(), e.target.value)}
                    renderValue={(items) => {
                      const item = items[0];
                      if (!item) return null;
                      return (
                        <Chip size="sm" color={getStatusColor(item.key as string)} variant="flat">
                          {item.textValue}
                        </Chip>
                      );
                    }}
                  >
                    {CONTACT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.key} textValue={opt.label}>
                        <Chip size="sm" color={opt.color} variant="flat">
                          {opt.label}
                        </Chip>
                      </SelectItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      isIconOnly
                      color="primary"
                      variant="light"
                      size="sm"
                      onPress={() => handleView(contact)}
                    >
                      <LuEye size={18} />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      size="sm"
                      onPress={() => handleDelete(contact.contactId.toString())}
                    >
                      <LuTrash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalles del Contacto
              </ModalHeader>
              <ModalBody>
                {selectedContact && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500 font-semibold">Nombre Completo</p>
                        <p className="text-base">{selectedContact.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500 font-semibold">Fecha</p>
                        <p className="text-base">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500 font-semibold">Email</p>
                        <p className="text-base">{selectedContact.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500 font-semibold">Teléfono</p>
                        <p className="text-base">{selectedContact.phone}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-default-500 font-semibold">Asunto</p>
                      <p className="text-base break-words font-medium">{selectedContact.assunto}</p>
                    </div>
                    <div className="mt-2 bg-default-100 p-4 rounded-lg">
                      <p className="text-sm text-default-500 font-semibold mb-2">Mensaje</p>
                      <p className="text-base whitespace-pre-wrap break-words">{selectedContact.message}</p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
