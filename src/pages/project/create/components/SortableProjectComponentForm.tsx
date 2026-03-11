import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProjectComponentForm } from "./ProjectComponentForm";

interface SortableProjectComponentFormProps {
  id: string;
  index: number;
  remove: (index: number) => void;
}

export const SortableProjectComponentForm = ({
  id,
  index,
  remove,
}: SortableProjectComponentFormProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative touch-none">
      <ProjectComponentForm
        index={index}
        remove={remove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
