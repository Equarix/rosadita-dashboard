import { Input, useDisclosure } from "@heroui/react";
import ImageGalleryModal from "@/module/blog/image-gallery/ImageGalleryModal";
import { LuImage } from "react-icons/lu";

interface InputImageProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
}

export default function InputImage({
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
}: InputImageProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <div onClick={onOpen} className="cursor-pointer pointer-events-auto w-full relative">
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          isReadOnly
          errorMessage={errorMessage}
          labelPlacement="inside"
          startContent={
            value ? (
              <div className="w-8 h-8 mr-2 rounded overflow-hidden flex-shrink-0 border border-default-200">
                <img src={value} alt="Preview" className="w-full h-full object-cover bg-default-100" />
              </div>
            ) : null
          }
          endContent={<LuImage size={20} className="text-default-500 ml-2" />}
          classNames={{
            input: "cursor-pointer",
            inputWrapper: "!cursor-pointer",
          }}
        />
        <div className="absolute inset-0 z-10 cursor-pointer" />
      </div>

      <ImageGalleryModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={(image) => {
          onChange?.(image.url);
        }}
      />
    </div>
  );
}
