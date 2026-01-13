import { z } from "zod";

export const CategoriaSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  color: z.string().min(1, "El color es obligatorio"),
});

export type CategoriaSchemaType = z.infer<typeof CategoriaSchema>;
