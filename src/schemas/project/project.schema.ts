import z from "zod";
import { ComponentSchema } from "../blog/blog.schema";

export const ProjectSchema = z.object({
  projectName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  categoryId: z.coerce.number().min(1, "Selecciona una categoría"),
  imageId: z.coerce.number().min(1, "ID de imagen requerido"),
  isPage: z.boolean().default(false).optional(),
  components: z.array(ComponentSchema).optional(),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
