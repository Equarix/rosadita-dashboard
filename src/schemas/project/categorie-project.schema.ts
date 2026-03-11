import z from "zod";

export const CategoryProjectSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  color: z.enum(["red", "blue", "green", "yellow", "purple"], "Color inválido"),
});

export type CategoryProjectInput = z.infer<typeof CategoryProjectSchema>;
