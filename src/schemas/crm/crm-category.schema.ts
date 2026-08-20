import z from "zod";

export const SpeachSchema = z.object({
  name: z.string().min(1, "El nombre del speach es obligatorio"),
  speach: z.string().min(1, "El contenido del speach es obligatorio"),
});

export const CrmCategorySchema = z.object({
  name: z.string().min(2, "El nombre de la categoría debe tener al menos 2 caracteres"),
  icon: z.string().min(1, "El ícono es obligatorio"),
  status: z.boolean().optional(),
  speaches: z.array(SpeachSchema).optional().default([]),
});

export type SpeachInput = z.infer<typeof SpeachSchema>;
export type CrmCategoryInput = z.infer<typeof CrmCategorySchema>;

