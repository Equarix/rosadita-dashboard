import z from "zod";

// Enums
export const ColorTypeEnum = z.enum([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
]);
export const ImageTypeEnum = z.enum(["ROUNDED", "CIRCLE", "SQUARE"]);
export const ComponentTypeEnum = z.enum([
  "HERO",
  "IMAGE",
  "CODE",
  "NEXT_ARTICLE",
  "TIME_LINE",
  "DETAILS",
  "QUOTE",
  "TEXT",
  "UNKNOWN",
]);
export const LanguageTypeEnum = z.enum([
  "TYPESCRIPT",
  "PYTHON",
  "JAVA",
  "CSHARP",
  "REACT",
  "HTML",
  "SQL",
]);

// Sub-component Schemas
const SpanSchema = z.object({
  text: z.string().min(1, "Texto requerido"),
  color: ColorTypeEnum,
});

const HeroComponentSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  span: SpanSchema,
  image: z.string().url("URL de imagen inválida"),
  buttonLive: z.string().optional().or(z.literal("")),
  buttonDemo: z.string().optional().or(z.literal("")),
  description: z.string().min(1, "Descripción requerida"),
});

const ImageComponentSchema = z.object({
  url: z.string().url("URL de imagen inválida"),
  imageType: ImageTypeEnum,
});

const CodeComponentSchema = z.object({
  code: z.string().min(1, "Código requerido"),
  type: LanguageTypeEnum,
});

const NextArticleComponentSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  header: z.string().min(1, "Encabezado requerido"),
  buttonText: z.string().min(1, "Texto del botón requerido"),
  articleUrl: z.string().min(1, "URL del artículo requerida"),
});

const TimeLineItemSchema = z.object({
  icon: z.string().min(1, "Icono requerido"),
  color: z.enum(["RED", "BLUE", "GREEN", "PURPLE", "YELLOW"]).or(z.string()), // Ajustado para flexibilidad o usar ColorTypeEnum si coincide
  title: z.string().min(1, "Título requerido"),
  description: z.string().min(1, "Descripción requerida"),
  position: z.enum(["LEFT", "RIGHT"]),
});

const DetailsItemSchema = z.object({
  header: z.string().min(1, "Encabezado requerido"),
  content: z.string().min(1, "Contenido requerido"),
});

const QuoteComponentSchema = z.object({
  quoteText: z.string().min(1, "Cita requerida"),
  userImage: z.string().url("URL de imagen inválida"),
  userName: z.string().min(1, "Nombre requerido"),
  userPosition: z.string().min(1, "Cargo requerido"),
});

const TextComponentSchema = z.object({
  content: z.record(z.string(), z.any()).or(z.string()), // Acepta JSON (Tiptap output)
});

const ComponentSchema = z.object({
  type: ComponentTypeEnum,
  heroComponent: HeroComponentSchema.optional(),
  imageComponent: ImageComponentSchema.optional(),
  codeComponent: CodeComponentSchema.optional(),
  nextArticleComponent: NextArticleComponentSchema.optional(),
  timeLineComponent: z.array(TimeLineItemSchema).optional(),
  detailsComponent: z.array(DetailsItemSchema).optional(),
  quoteComponent: QuoteComponentSchema.optional(),
  textComponent: TextComponentSchema.optional(),
});

export const BlogSchema = z.object({
  blogName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  blogKey: z.string().min(1, "La clave del blog es requerida"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  timeline: z.string().min(1, "El tiempo de lectura es requerido"),
  categoryId: z.coerce.number().min(1, "Selecciona una categoría"),
  imageId: z.coerce.number().min(1, "ID de imagen requerido"),
  components: z.array(ComponentSchema).optional(),
});

export type BlogInput = z.infer<typeof BlogSchema>;
