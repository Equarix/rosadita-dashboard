import z from "zod";

export const CrmCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  icon: z.string().min(1, "El ícono es obligatorio"),
  status: z.boolean().optional(),
  speach: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
});

export type CrmCategoryInput = z.infer<typeof CrmCategorySchema>;
