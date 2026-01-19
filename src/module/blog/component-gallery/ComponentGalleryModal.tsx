import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { COMPONENT_DEFINITIONS, type ComponentCategory } from "./gallery.data";

interface ComponentGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string, defaultValues: unknown) => void;
}

const CATEGORIES: (ComponentCategory | "All")[] = [
  "All",
  "Layout",
  "Content",
  "Media",
  "Navigation",
];

export default function ComponentGalleryModal({
  isOpen,
  onClose,
  onSelect,
}: ComponentGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ComponentCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const filteredComponents = COMPONENT_DEFINITIONS.filter((comp) => {
    const matchesCategory =
      selectedCategory === "All" || comp.category === selectedCategory;
    const matchesSearch =
      comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConfirm = () => {
    if (selectedComponent) {
      const def = COMPONENT_DEFINITIONS.find(
        (c) => c.type === selectedComponent
      );
      if (def) {
        onSelect(def.type, def.defaultValues);
        onClose();
        // Reset state
        setSelectedComponent(null);
        setSearchQuery("");
        setSelectedCategory("All");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent className="h-[80vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Galería de Componentes
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4 px-0 py-0">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 bg-background z-10 py-2 px-6">
                <Tabs
                  selectedKey={selectedCategory}
                  onSelectionChange={(key) =>
                    setSelectedCategory(key as ComponentCategory | "All")
                  }
                  color="primary"
                  variant="underlined"
                >
                  {CATEGORIES.map((cat) => (
                    <Tab key={cat} title={cat} />
                  ))}
                </Tabs>
                <Input
                  classNames={{
                    base: "max-w-full sm:max-w-[15rem] h-10",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                  }}
                  placeholder="Buscar componente..."
                  size="sm"
                  startContent={<LuSearch size={18} />}
                  type="search"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4 px-6">
                {filteredComponents.map((comp) => (
                  <div
                    key={comp.type}
                    onClick={() => setSelectedComponent(comp.type)}
                    className={`
                        group relative flex flex-col gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200
                        hover:border-primary hover:bg-primary-50/10
                        ${
                          selectedComponent === comp.type
                            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary-50/10"
                            : "border-default-200"
                        }
                    `}
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-default-100 relative">
                      <img
                        src={comp.image}
                        alt={comp.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Chip size="sm" color="default" variant="flat">
                          {comp.category}
                        </Chip>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{comp.label}</h3>
                      <p className="text-sm text-default-500 line-clamp-2">
                        {comp.description}
                      </p>
                    </div>
                  </div>
                ))}

                {filteredComponents.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-default-400">
                    <p>No se encontraron componentes.</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                isDisabled={!selectedComponent}
              >
                Agregar Componente
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
