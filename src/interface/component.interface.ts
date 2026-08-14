import type { ColorType, ImageType } from "./response.interface";

export interface Component {
  type: ComponentType;
  heroComponent?: HeroComponent;
  imageComponent?: ImageComponent;
  codeComponent?: CodeComponent;
  nextArticleComponent?: NextArticleComponent;
  timeLineComponent?: TimeLineComponent[];
  detailsComponent?: DetailsComponent[];
  quoteComponent?: QuoteComponent;
  testimonialsComponent?: TestimonialsComponent;
  carrouselComponent?: CarrouselComponent;
  tableComponent?: TableComponent;
}

export interface HeroComponent {
  title: string;
  span: Span;
  image: string;
  buttonLive: string;
  buttonDemo: string;
  description: string;
}

export interface Span {
  text: string;
  color: ColorType;
}

export interface ImageComponent {
  url: string;
  imageType: ImageType;
}

export interface CodeComponent {
  code: string;
  type: LanguageType;
}

export interface NextArticleComponent {
  title: string;
  header: string;
  buttonText: string;
  articleUrl: string;
}

export interface TimeLineComponent {
  icon: string;
  color: string;
  title: string;
  description: string;
  position: string;
}

export interface DetailsComponent {
  header: string;
  content: string;
}

export interface QuoteComponent {
  quoteText: string;
  userImage: string;
  userName: string;
  userPosition: string;
}

export interface TestimonialItem {
  starts: number;
  description: string;
  name: string;
  position: string;
}

export interface TestimonialsComponent {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

export interface CarrouselComponent {
  title: string;
  subtitle: string;
  description: string;
  urls: string[];
}

export interface TableColumn {
  id: string;
  label: string;
  type: string;
  visible?: boolean;
  autoWidth?: boolean;
}

export interface TableRow {
  values: Record<string, unknown>;
}

export interface TableSettings {
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}

export interface TableComponent {
  name: string;
  description?: string;
  columns: TableColumn[];
  rows: TableRow[];
  settings?: TableSettings;
}

export type ComponentType =
  | "HERO"
  | "IMAGE"
  | "CODE"
  | "NEXT_ARTICLE"
  | "TIME_LINE"
  | "DETAILS"
  | "QUOTE"
  | "TEXT"
  | "IMAGE_CAPTION"
  | "QUESTIONS"
  | "STATS"
  | "HEADER"
  | "TESTIMONIALS"
  | "CARROUSEL"
  | "TABLE"
  | "UNKNOWN";

export type LanguageType =
  | "TYPESCRIPT"
  | "PYTHON"
  | "JAVA"
  | "CSHARP"
  | "REACT"
  | "HTML"
  | "SQL";
