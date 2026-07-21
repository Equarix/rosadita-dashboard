import { z } from "zod";

export const ClientSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío"),
  url: z.string().url("Debe ser una URL válida").min(1, "La URL no puede estar vacía"),
  feature: z.boolean().default(false),
});

export type ClientInput = z.infer<typeof ClientSchema>;
