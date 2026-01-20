import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlogComponentForm } from "./BlogComponentForm";

interface SortableBlogComponentFormProps {
  id: string;
  index: number;
  remove: (index: number) => void;
}

export const SortableBlogComponentForm = ({
  id,
  index,
  remove,
}: SortableBlogComponentFormProps) => {
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
      <BlogComponentForm
        index={index}
        remove={remove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
