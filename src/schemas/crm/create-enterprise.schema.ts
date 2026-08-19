import z from "zod";

export const ScheduleSchema = z.object({
  day: z.string().min(1, "El día es obligatorio"),
  hours: z.string().min(1, "El horario es obligatorio"),
});

export const CreateEnterpriseSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  address: z.string().min(3, "La dirección debe tener al menos 3 caracteres"),
  street: z.string().min(2, "La calle debe tener al menos 2 caracteres"),
  phone: z.string().min(3, "El teléfono debe tener al menos 3 caracteres"),
  reviewCount: z.coerce.number().min(0).optional(),
  stars: z.coerce.number().min(0).max(5).optional(),
  urlGoogleMaps: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  website: z.string().optional(),
  schedules: z.array(ScheduleSchema).optional(),
  categoryId: z.coerce.number().min(1, "Debes seleccionar una categoría"),
});

export type CreateEnterpriseInput = z.infer<typeof CreateEnterpriseSchema>;
