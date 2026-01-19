import z from "zod";
import { ComponentTypeEnum } from "@/schemas/blog/blog.schema";
import HeroImage from "@/assets/images/hero_component.png";
import ImageComponent from "@/assets/images/image_component.png";
import CodeComponent from "@/assets/images/code_component.png";
import NextArticleComponent from "@/assets/images/next_article_component.png";
import TimeLineComponent from "@/assets/images/time_line_component.png";
import DetailsComponent from "@/assets/images/details_component.png";
import QuoteComponent from "@/assets/images/quote_component.png";

export type ComponentCategory = "Layout" | "Media" | "Content" | "Navigation";

export interface ComponentDefinition {
  type: z.infer<typeof ComponentTypeEnum>;
  label: string;
  description: string;
  category: ComponentCategory;
  image: string; // URL or local path
  defaultValues: unknown;
}

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: "HERO",
    label: "Hero Section",
    description: "Sección principal con título, imagen y botones de acción.",
    category: "Layout",
    image: HeroImage,
    defaultValues: {
      heroComponent: {
        title: "",
        span: { text: "", color: "blue" },
        image: "",
        description: "",
      },
    },
  },
  {
    type: "IMAGE",
    label: "Imagen",
    description:
      "Imagen con opciones de borde redondeado, circular o cuadrado.",
    category: "Media",
    image: ImageComponent,
    defaultValues: {
      imageComponent: {
        url: "",
        imageType: "ROUNDED",
      },
    },
  },
  {
    type: "CODE",
    label: "Bloque de Código",
    description: "Muestra código con resaltado de sintaxis.",
    category: "Content",
    image: CodeComponent,
    defaultValues: {
      codeComponent: {
        code: "",
        type: "TYPESCRIPT",
      },
    },
  },
  {
    type: "NEXT_ARTICLE",
    label: "Siguiente Artículo",
    description: "Tarjeta para navegar al siguiente artículo relacionado.",
    category: "Navigation",
    image: NextArticleComponent,
    defaultValues: {
      nextArticleComponent: {
        title: "",
        header: "",
        buttonText: "",
        articleUrl: "",
      },
    },
  },
  {
    type: "TIME_LINE",
    label: "Línea de Tiempo",
    description: "Lista de eventos o pasos en orden cronológico.",
    category: "Content",
    image: TimeLineComponent,
    defaultValues: {
      timeLineComponent: [
        {
          title: "Paso 1",
          icon: "LuCircle",
          description: "Descripción...",
          color: "BLUE",
          position: "RIGHT",
        },
      ],
    },
  },
  {
    type: "DETAILS",
    label: "Detalles",
    description: "Lista de detalles clave (Cliente, Industria, etc.).",
    category: "Content",
    image: DetailsComponent,
    defaultValues: {
      detailsComponent: [{ header: "Header", content: "Content" }],
    },
  },
  {
    type: "QUOTE",
    label: "Cita",
    description: "Bloque para resaltar testimonios o citas importantes.",
    category: "Content",
    image: QuoteComponent,
    defaultValues: {
      quoteComponent: {
        quoteText: "",
        userName: "",
        userPosition: "",
        userImage: "",
      },
    },
  },
];
