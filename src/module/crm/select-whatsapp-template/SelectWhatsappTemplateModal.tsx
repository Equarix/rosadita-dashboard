import { useState } from "react";
import type { SpeachItem } from "@/interface/response.interface";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { FaWhatsapp } from "react-icons/fa";
import { LuExternalLink, LuMessageSquare } from "react-icons/lu";

interface SelectWhatsappTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  enterpriseName: string;
  speaches?: SpeachItem[];
}

export default function SelectWhatsappTemplateModal({
  isOpen,
  onClose,
  phone,
  enterpriseName,
  speaches = [],
}: SelectWhatsappTemplateModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<string>("0");

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";

  // Convert HTML or rich text to plain text for WhatsApp URL preserving line breaks
  const formatSpeachText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\n\s*\n\s*\n+/g, "\n\n")
      .trim();
  };

  const handleSendWhatsApp = (text?: string) => {
    let messageText = "";
    if (text) {
      messageText = formatSpeachText(text);
    } else if (speaches.length > 0 && speaches[Number(selectedIndex)]) {
      messageText = formatSpeachText(speaches[Number(selectedIndex)].speach);
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}${
      messageText ? `?text=${encodeURIComponent(messageText)}` : ""
    }`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 text-foreground font-bold">
          <FaWhatsapp className="size-5 text-green-600" />
          <span>Enviar WhatsApp a {enterpriseName}</span>
        </ModalHeader>

        <ModalBody className="py-3 flex flex-col gap-4">
          <p className="text-xs text-default-500">
            Selecciona la plantilla de discurso (speech) que deseas incluir en el mensaje para <strong>{phone}</strong>:
          </p>

          {speaches && speaches.length > 0 ? (
            <RadioGroup
              value={selectedIndex}
              onValueChange={setSelectedIndex}
              className="gap-3"
            >
              {speaches.map((item, idx) => {
                const plainText = formatSpeachText(item.speach);
                return (
                  <Radio
                    key={idx}
                    value={idx.toString()}
                    className="max-w-full border border-default-200 hover:border-primary rounded-xl p-3 bg-default-50/50 transition-all data-[selected=true]:border-primary data-[selected=true]:bg-primary-50/20"
                  >
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-bold text-foreground text-sm">
                        {item.name || `Plantilla ${idx + 1}`}
                      </span>
                      <p className="text-default-600 line-clamp-3 whitespace-pre-wrap bg-background p-2 rounded-lg border border-default-100 font-sans">
                        {plainText}
                      </p>
                    </div>
                  </Radio>
                );
              })}
            </RadioGroup>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-default-400 gap-2 border border-dashed border-default-200 rounded-xl">
              <LuMessageSquare className="size-8 text-default-300" />
              <p className="text-sm font-medium">No hay plantillas registradas para esta categoría.</p>
              <p className="text-xs text-default-400">
                Puedes continuar enviando un mensaje directo sin plantilla predefinida.
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex items-center justify-between">
          <Button variant="flat" size="sm" onPress={onClose}>
            Cancelar
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="flat"
              color="default"
              size="sm"
              onPress={() => handleSendWhatsApp("")}
            >
              Enviar sin plantilla
            </Button>
            <Button
              color="success"
              size="sm"
              className="text-white font-semibold bg-green-600 hover:bg-green-700 flex items-center gap-1.5"
              onPress={() => handleSendWhatsApp()}
            >
              <FaWhatsapp className="size-4" />
              <span>Abrir WhatsApp</span>
              <LuExternalLink className="size-3.5" />
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
