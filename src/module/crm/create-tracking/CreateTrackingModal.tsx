import { useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import TiptapEditor from "@/components/shared/editor/TiptapEditor";
import { instance } from "@/libs/axios";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { LuActivity, LuCalendar, LuMessageSquare } from "react-icons/lu";

interface CreateTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  enterpriseId: number;
  enterpriseName?: string;
}

const CHANNELS = [
  "Whatsapp",
  "Llamada",
  "Email",
  "Reunión",
  "Instagram",
  "Facebook",
  "Otro",
];

const TRACKING_STATUSES = [
  { key: "PENDING", label: "Pendiente" },
  { key: "IN_PROGRESS", label: "En Progreso" },
  { key: "COMPLETED", label: "Completado" },
  { key: "CANCELLED", label: "Cancelado" },
];

export default function CreateTrackingModal({
  isOpen,
  onClose,
  onSuccess,
  enterpriseId,
  enterpriseName,
}: CreateTrackingModalProps) {
  const { token } = useAuth();

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [date, setDate] = useState<string>(getTodayString());
  const [channel, setChannel] = useState<string>("Whatsapp");
  const [status, setStatus] = useState<string>("PENDING");
  const [answered, setAnswered] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");

  const resetForm = () => {
    setDate(getTodayString());
    setChannel("Whatsapp");
    setStatus("PENDING");
    setAnswered(true);
    setNotes("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!channel) throw new Error("Debes indicar el canal");
      if (!date) throw new Error("Debes seleccionar una fecha");
      if (!enterpriseId) throw new Error("ID de empresa inválido");

      const payload = {
        enterpriseId,
        date,
        channel,
        status,
        answered,
        notes,
      };

      const res = await instance.post("/crm/tracking", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Seguimiento registrado exitosamente",
        color: "success",
      });
      handleClose();
      onSuccess();
    },
    onError: (error: Error) => {
      addToast({
        title: error.message || "Error al registrar seguimiento",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="2xl" scrollBehavior="inside">
      <Load loading={isPending} />
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary font-bold text-lg">
                <LuActivity className="size-6" />
                <span>Nuevo Seguimiento</span>
              </div>
              {enterpriseName && (
                <p className="text-xs text-default-500 font-normal">
                  Registrando seguimiento para{" "}
                  <span className="font-semibold text-foreground">{enterpriseName}</span>
                </p>
              )}
            </ModalHeader>

            <ModalBody className="flex flex-col gap-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Canal */}
                <Select
                  label="Canal de comunicación"
                  placeholder="Selecciona canal"
                  selectedKeys={channel ? [channel] : []}
                  onChange={(e) => setChannel(e.target.value)}
                  isRequired
                >
                  {CHANNELS.map((ch) => (
                    <SelectItem key={ch} textValue={ch}>
                      {ch}
                    </SelectItem>
                  ))}
                </Select>

                {/* Fecha */}
                <Input
                  type="date"
                  label="Fecha"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  startContent={<LuCalendar className="text-default-400 size-4" />}
                  isRequired
                />

                {/* Estado */}
                <Select
                  label="Estado del seguimiento"
                  placeholder="Selecciona estado"
                  selectedKeys={status ? [status] : []}
                  onChange={(e) => setStatus(e.target.value)}
                  isRequired
                >
                  {TRACKING_STATUSES.map((st) => (
                    <SelectItem key={st.key} textValue={st.label}>
                      {st.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Answered Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-default-200 bg-default-50/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">¿Fue Respondido?</span>
                    <span className="text-[11px] text-default-400">
                      {answered ? "El cliente respondió" : "Sin respuesta aún"}
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    isSelected={answered}
                    onValueChange={setAnswered}
                    color="success"
                  />
                </div>
              </div>

              {/* Tiptap Rich Text Notes */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <LuMessageSquare className="size-4 text-primary" />
                  <span>Notas del seguimiento</span>
                </div>
                <TiptapEditor
                  content={notes}
                  onChange={(html) => setNotes(html)}
                  outputFormat="html"
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={handleClose}
                type="button"
              >
                Cancelar
              </Button>

              <Button
                color="primary"
                className="font-semibold"
                onPress={() => mutate()}
                isDisabled={!channel || !date}
                isLoading={isPending}
              >
                Guardar Seguimiento
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
