import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
  Tabs,
  Tab,
} from "@heroui/react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  LuTrash,
  LuGripVertical,
  LuChevronUp,
  LuChevronDown,
} from "react-icons/lu";
import { cn } from "@/utils/cn";
import { listColor } from "@/utils/listColor";
import InputIcon from "@/components/shared/input/InputIcon";
import InputImage from "@/components/shared/input/InputImage";
import TiptapEditor from "@/components/shared/editor/TiptapEditor";

interface BlogComponentFormProps {
  index: number;
  remove: (index: number) => void;
}

export const BlogComponentForm = ({
  index,
  remove,
  dragHandleProps,
}: BlogComponentFormProps & { dragHandleProps?: any }) => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const type = watch(`components.${index}.type`);
  const [isOpen, setIsOpen] = useState(false);

  const componentNames: Record<string, string> = {
    HERO: "Hero (Héroe)",
    IMAGE: "Imagen",
    CODE: "Editor de Código",
    NEXT_ARTICLE: "Siguiente Artículo",
    TIME_LINE: "Línea de Tiempo",
    DETAILS: "Detalles",
    QUOTE: "Cita / Quote",
    TEXT: "Texto Enriquecido",
    IMAGE_CAPTION: "Imágenes con Caption",
    QUESTIONS: "Preguntas Frecuentes",
    STATS: "Estadísticas",
    HEADER: "Header (Encabezado)",
    TESTIMONIALS: "Testimonios",
    CARROUSEL: "Carrusel",
    UNKNOWN: "Desconocido",
  };

  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({ control, name: `components.${index}.detailsComponent` });
  const {
    fields: timelineFields,
    append: appendTimeLineItem,
    remove: removeTimeLineItem,
  } = useFieldArray({ control, name: `components.${index}.timeLineComponent` });
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `components.${index}.questionsComponent.questions`,
  });
  const {
    fields: statsFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({ control, name: `components.${index}.statsComponent` });
  const {
    fields: imgFields,
    append: appendImg,
    remove: removeImg,
  } = useFieldArray({
    control,
    name: `components.${index}.imageCaptionComponent.images`,
  });
  const {
    fields: btnFields,
    append: appendBtn,
    remove: removeBtn,
  } = useFieldArray({
    control,
    name: `components.${index}.headerComponent.buttons`,
  });
  const {
    fields: headerItemFields,
    append: appendHeaderItem,
    remove: removeHeaderItem,
  } = useFieldArray({
    control,
    name: `components.${index}.headerComponent.items`,
  });
  const {
    fields: testimonialFields,
    append: appendTestimonial,
    remove: removeTestimonial,
  } = useFieldArray({
    control,
    name: `components.${index}.testimonialsComponent.testimonials`,
  });
  const {
    fields: carrouselUrlFields,
    append: appendCarrouselUrl,
    remove: removeCarrouselUrl,
  } = useFieldArray({
    control,
    name: `components.${index}.carrouselComponent.urls`,
  });

  // Helper to get error message safely
  const getError = (path: string) => {
    // This is a simplified error accessor, ideally use lodash/get or similar
    const err = (errors?.components as any)?.[index];
    if (!err) return undefined;

    const parts = path.split(".");
    let current = err;
    for (const part of parts) {
      current = current?.[part];
    }
    return current?.message;
  };

  const renderHeroFields = () => (
    <div className="flex flex-col gap-3">
      <Input
        label="Título"
        {...register(`components.${index}.heroComponent.title`)}
        errorMessage={getError("heroComponent.title") as string}
      />
      <div className="flex gap-2">
        <Input
          label="Span Texto"
          {...register(`components.${index}.heroComponent.span.text`)}
          errorMessage={getError("heroComponent.span.text") as string}
        />
        <Select
          label="Span Color"
          items={listColor}
          selectedKeys={[
            watch(`components.${index}.heroComponent.span.color`) || "blue",
          ]}
          onChange={(e) => {
            setValue(
              `components.${index}.heroComponent.span.color`,
              e.target.value,
            );
          }}
        >
          {(color) => (
            <SelectItem key={color.value} textValue={color.label}>
              <div className="flex items-center gap-2">
                <span className={cn(`size-4 inline-block`, color.className)} />
                {color.label}
              </div>
            </SelectItem>
          )}
        </Select>
      </div>
      <InputImage
        label="Imagen URL"
        value={watch(`components.${index}.heroComponent.image`) || ""}
        onChange={(val) => setValue(`components.${index}.heroComponent.image`, val)}
        errorMessage={getError("heroComponent.image") as string}
      />
      <div className="flex gap-2">
        <Input
          label="Botón Live"
          {...register(`components.${index}.heroComponent.buttonLive`)}
        />
        <Input
          label="Botón Demo"
          {...register(`components.${index}.heroComponent.buttonDemo`)}
        />
      </div>
      <Textarea
        label="Descripción"
        {...register(`components.${index}.heroComponent.description`)}
        errorMessage={getError("heroComponent.description") as string}
      />
    </div>
  );

  const renderImageFields = () => (
    <div className="flex flex-col gap-3">
      <InputImage
        label="Imagen URL"
        value={watch(`components.${index}.imageComponent.url`) || ""}
        onChange={(val) => setValue(`components.${index}.imageComponent.url`, val)}
        errorMessage={getError("imageComponent.url") as string}
      />
      <Select
        label="Tipo de Imagen"
        {...register(`components.${index}.imageComponent.imageType`)}
        defaultSelectedKeys={["ROUNDED"]}
      >
        {["ROUNDED", "CIRCLE", "SQUARE"].map((c) => (
          <SelectItem key={c}>{c}</SelectItem>
        ))}
      </Select>
    </div>
  );

  const renderCodeFields = () => (
    <div className="flex flex-col gap-3">
      <Textarea
        label="Código"
        {...register(`components.${index}.codeComponent.code`)}
        errorMessage={getError("codeComponent.code") as string}
      />
      <Select
        label="Lenguaje"
        {...register(`components.${index}.codeComponent.type`)}
        defaultSelectedKeys={["TYPESCRIPT"]}
      >
        {["TYPESCRIPT", "PYTHON", "JAVA", "CSHARP", "REACT", "HTML", "SQL"].map(
          (c) => (
            <SelectItem key={c}>{c}</SelectItem>
          ),
        )}
      </Select>
    </div>
  );

  const renderNextArticleFields = () => (
    <div className="flex flex-col gap-3">
      <Input
        label="Título"
        {...register(`components.${index}.nextArticleComponent.title`)}
        errorMessage={getError("nextArticleComponent.title") as string}
      />
      <Input
        label="Header"
        {...register(`components.${index}.nextArticleComponent.header`)}
        errorMessage={getError("nextArticleComponent.header") as string}
      />
      <Input
        label="Texto Botón"
        {...register(`components.${index}.nextArticleComponent.buttonText`)}
        errorMessage={getError("nextArticleComponent.buttonText") as string}
      />
      <Input
        label="URL Artículo"
        {...register(`components.${index}.nextArticleComponent.articleUrl`)}
        errorMessage={getError("nextArticleComponent.articleUrl") as string}
      />
    </div>
  );

  const renderDetailsFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold">Detalles</h4>
        {detailFields.map((field, k) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              label="Header"
              {...register(`components.${index}.detailsComponent.${k}.header`)}
            />
            <Input
              label="Content"
              {...register(`components.${index}.detailsComponent.${k}.content`)}
            />
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => removeDetail(k)}
            >
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() => appendDetail({ header: "", content: "" })}
        >
          Agregar Detalle
        </Button>
      </div>
    );
  };

  const renderTimeLineFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold">Linea de Tiempo</h4>
        {timelineFields.map((field, k) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 border p-2 rounded"
          >
            <div className="flex justify-between">
              <span className="text-xs">Item {k + 1}</span>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={() => removeTimeLineItem(k)}
              >
                <LuTrash />
              </Button>
            </div>
            <Input
              label="Title"
              {...register(`components.${index}.timeLineComponent.${k}.title`)}
            />
            <InputIcon
              label="Icon (Lucide Name)"
              value={
                watch(`components.${index}.timeLineComponent.${k}.icon`) || ""
              }
              onChange={(val) =>
                setValue(`components.${index}.timeLineComponent.${k}.icon`, val)
              }
            />
            <Input
              label="Description"
              {...register(
                `components.${index}.timeLineComponent.${k}.description`,
              )}
            />
            <div className="flex gap-2">
              <Select
                label="Color"
                items={listColor}
                selectedKeys={[
                  watch(`components.${index}.timeLineComponent.${k}.color`) ||
                    "BLUE",
                ]}
                onChange={(e) => {
                  setValue(
                    `components.${index}.timeLineComponent.${k}.color`,
                    e.target.value,
                  );
                }}
              >
                {(color) => (
                  <SelectItem key={color.value} textValue={color.label}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(`size-4 inline-block`, color.className)}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Select
                label="Position"
                {...register(
                  `components.${index}.timeLineComponent.${k}.position`,
                )}
                defaultSelectedKeys={["RIGHT"]}
              >
                {["LEFT", "RIGHT"].map((c) => (
                  <SelectItem key={c}>{c}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() =>
            appendTimeLineItem({
              title: "",
              icon: "",
              description: "",
              color: "BLUE",
              position: "RIGHT",
            })
          }
        >
          Agregar Item
        </Button>
      </div>
    );
  };

  const renderQuoteFields = () => (
    <div className="flex flex-col gap-3">
      <Textarea
        label="Cita"
        {...register(`components.${index}.quoteComponent.quoteText`)}
        errorMessage={getError("quoteComponent.quoteText") as string}
      />
      <Input
        label="Nombre Usuario"
        {...register(`components.${index}.quoteComponent.userName`)}
        errorMessage={getError("quoteComponent.userName") as string}
      />
      <Input
        label="Cargo Usuario"
        {...register(`components.${index}.quoteComponent.userPosition`)}
        errorMessage={getError("quoteComponent.userPosition") as string}
      />
      <InputImage
        label="Imagen Usuario URL"
        value={watch(`components.${index}.quoteComponent.userImage`) || ""}
        onChange={(val) => setValue(`components.${index}.quoteComponent.userImage`, val)}
        errorMessage={getError("quoteComponent.userImage") as string}
      />
    </div>
  );

  const renderTextFields = () => (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Contenido</label>
      <TiptapEditor
        content={watch(`components.${index}.textComponent.content`) || {}}
        onChange={(json) => {
          setValue(`components.${index}.textComponent.content`, json);
        }}
      />
      {getError("textComponent.content") && (
        <span className="text-tiny text-danger">
          {getError("textComponent.content") as string}
        </span>
      )}
    </div>
  );

  const renderQuestionsFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Subheading"
          {...register(`components.${index}.questionsComponent.subHeading`)}
        />
        <Input
          label="Header"
          {...register(`components.${index}.questionsComponent.header`)}
        />

        <h4 className="text-sm font-semibold mt-2">Preguntas</h4>
        {questionFields.map((field, k) => (
          <div
            key={field.id}
            className="flex gap-2 items-center border-l-2 pl-2"
          >
            <div className="flex flex-col gap-2 flex-1">
              <Input
                label="Pregunta"
                {...register(
                  `components.${index}.questionsComponent.questions.${k}.question`,
                )}
              />
              <Input
                label="Respuesta"
                {...register(
                  `components.${index}.questionsComponent.questions.${k}.answer`,
                )}
              />
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => removeQuestion(k)}
            >
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() => appendQuestion({ question: "", answer: "" })}
        >
          Agregar Pregunta
        </Button>
      </div>
    );
  };

  const renderStatsFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold">Estadísticas</h4>
        {statsFields.map((field, k) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 border p-2 rounded"
          >
            <div className="flex justify-between">
              <span className="text-xs">Stat {k + 1}</span>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={() => removeStat(k)}
              >
                <LuTrash />
              </Button>
            </div>
            <Input
              label="Texto"
              {...register(`components.${index}.statsComponent.${k}.text`)}
            />
            <Input
              label="Descripción"
              {...register(
                `components.${index}.statsComponent.${k}.description`,
              )}
            />
            <InputIcon
              label="Icon (Lucide Name)"
              value={
                watch(`components.${index}.statsComponent.${k}.icon`) || ""
              }
              onChange={(val) =>
                setValue(`components.${index}.statsComponent.${k}.icon`, val)
              }
            />
            <div className="flex gap-2">
              <Select
                label="Color"
                items={listColor}
                selectedKeys={[
                  watch(`components.${index}.statsComponent.${k}.color`) ||
                    "blue",
                ]}
                onChange={(e) =>
                  setValue(
                    `components.${index}.statsComponent.${k}.color`,
                    e.target.value,
                  )
                }
              >
                {(color) => (
                  <SelectItem key={color.value} textValue={color.label}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(`size-4 inline-block`, color.className)}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Select
                label="Posición de Icono"
                {...register(
                  `components.${index}.statsComponent.${k}.positionIcon`,
                )}
                defaultSelectedKeys={["LEFT"]}
              >
                {["LEFT", "RIGHT", "TOP", "BOTTOM"].map((c) => (
                  <SelectItem key={c}>{c}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() =>
            appendStat({
              text: "",
              description: "",
              color: "blue",
              positionIcon: "LEFT",
              icon: "",
            })
          }
        >
          Agregar Estadística
        </Button>
      </div>
    );
  };

  const renderImageCaptionFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Header"
          {...register(`components.${index}.imageCaptionComponent.header`)}
        />
        <Input
          label="Subheading"
          {...register(`components.${index}.imageCaptionComponent.subheading`)}
        />
        <Textarea
          label="Descripción"
          {...register(`components.${index}.imageCaptionComponent.description`)}
        />

        <h4 className="text-sm font-semibold mt-2">Imágenes</h4>
        {imgFields.map((field, k) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 border p-2 rounded"
          >
            <div className="flex justify-between">
              <span className="text-xs">Imagen {k + 1}</span>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={() => removeImg(k)}
              >
                <LuTrash />
              </Button>
            </div>
            <InputImage
              label="URL de la Imagen"
              value={watch(`components.${index}.imageCaptionComponent.images.${k}.url`) || ""}
              onChange={(val) => setValue(`components.${index}.imageCaptionComponent.images.${k}.url`, val)}
            />
            <Input
              label="Caption"
              {...register(
                `components.${index}.imageCaptionComponent.images.${k}.caption`,
              )}
            />
            <InputIcon
              label="Icon (Lucide Name)"
              value={
                watch(
                  `components.${index}.imageCaptionComponent.images.${k}.icon`,
                ) || ""
              }
              onChange={(val) =>
                setValue(
                  `components.${index}.imageCaptionComponent.images.${k}.icon`,
                  val,
                )
              }
            />
          </div>
        ))}
        <Button
          size="sm"
          onPress={() => appendImg({ url: "", caption: "", icon: "" })}
        >
          Agregar Imagen
        </Button>
      </div>
    );
  };

  const renderHeaderFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Nombre del Proyecto"
          {...register(`components.${index}.headerComponent.proyectName`)}
          errorMessage={getError("headerComponent.proyectName") as string}
        />
        <Input
          label="Icono del Proyecto (URL)"
          {...register(`components.${index}.headerComponent.proyectIcon`)}
          errorMessage={getError("headerComponent.proyectIcon") as string}
        />
        <Switch
          isSelected={
            watch(`components.${index}.headerComponent.isFixed`) || false
          }
          onValueChange={(val) =>
            setValue(`components.${index}.headerComponent.isFixed`, val)
          }
        >
          ¿Es fijo (Fixed)?
        </Switch>

        <h4 className="text-sm font-semibold mt-2">Botones</h4>
        {btnFields.map((field, k) => (
          <div
            key={field.id}
            className="flex gap-2 items-center border-l-2 pl-2"
          >
            <div className="flex flex-col gap-2 flex-1">
              <Input
                label="Nombre"
                {...register(
                  `components.${index}.headerComponent.buttons.${k}.name`,
                )}
              />
              <Input
                label="Link"
                {...register(
                  `components.${index}.headerComponent.buttons.${k}.link`,
                )}
              />
              <Input
                label="Key"
                {...register(
                  `components.${index}.headerComponent.buttons.${k}.key`,
                )}
              />
              <Switch
                isSelected={
                  watch(
                    `components.${index}.headerComponent.buttons.${k}.isExternal`,
                  ) || false
                }
                onValueChange={(val) =>
                  setValue(
                    `components.${index}.headerComponent.buttons.${k}.isExternal`,
                    val,
                  )
                }
              >
                ¿Es externo?
              </Switch>
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => removeBtn(k)}
            >
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() =>
            appendBtn({ name: "", link: "", key: "", isExternal: false })
          }
        >
          Agregar Botón
        </Button>

        <h4 className="text-sm font-semibold mt-2">Items</h4>
        {headerItemFields.map((field, k) => (
          <div
            key={field.id}
            className="flex gap-2 items-center border-l-2 pl-2"
          >
            <div className="flex flex-col gap-2 flex-1">
              <Input
                label="Nombre"
                {...register(
                  `components.${index}.headerComponent.items.${k}.name`,
                )}
              />
              <Input
                label="Key"
                {...register(
                  `components.${index}.headerComponent.items.${k}.key`,
                )}
              />
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => removeHeaderItem(k)}
            >
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() => appendHeaderItem({ name: "", key: "" })}
        >
          Agregar Item
        </Button>
      </div>
    );
  };

  const renderTestimonialsFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Título"
          {...register(`components.${index}.testimonialsComponent.title`)}
          errorMessage={getError("testimonialsComponent.title") as string}
        />
        <Input
          label="Subtítulo"
          {...register(`components.${index}.testimonialsComponent.subtitle`)}
          errorMessage={getError("testimonialsComponent.subtitle") as string}
        />

        <h4 className="text-sm font-semibold mt-2">Testimonios</h4>
        {testimonialFields.map((field, k) => (
          <div
            key={field.id}
            className="flex gap-2 items-center border-l-2 pl-2"
          >
            <div className="flex flex-col gap-2 flex-1">
              <Input
                label="Descripción"
                {...register(
                  `components.${index}.testimonialsComponent.testimonials.${k}.description`,
                )}
              />
              <Input
                label="Estrellas (Starts)"
                type="number"
                {...register(
                  `components.${index}.testimonialsComponent.testimonials.${k}.starts`,
                )}
              />
              <Input
                label="Nombre"
                {...register(
                  `components.${index}.testimonialsComponent.testimonials.${k}.name`,
                )}
              />
              <Input
                label="Cargo/Posición"
                {...register(
                  `components.${index}.testimonialsComponent.testimonials.${k}.position`,
                )}
              />
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => removeTestimonial(k)}
            >
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          onPress={() =>
            appendTestimonial({
              description: "",
              starts: 5,
              name: "",
              position: "",
            })
          }
        >
          Agregar Testimonio
        </Button>
      </div>
    );
  };

  const renderCarrouselFields = () => {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Título"
          {...register(`components.${index}.carrouselComponent.title`)}
          errorMessage={getError("carrouselComponent.title") as string}
        />
        <Input
          label="Subtítulo"
          {...register(`components.${index}.carrouselComponent.subtitle`)}
          errorMessage={getError("carrouselComponent.subtitle") as string}
        />
        <Textarea
          label="Descripción"
          {...register(`components.${index}.carrouselComponent.description`)}
          errorMessage={getError("carrouselComponent.description") as string}
        />
        
        <h4 className="text-sm font-semibold mt-2">URLs de las imágenes (Ej. logos)</h4>
        {carrouselUrlFields.map((field, k) => (
          <div key={field.id} className="flex gap-2 items-center border-l-2 pl-2">
            <div className="flex flex-col gap-2 flex-1">
              <Input label={`URL ${k + 1}`} {...register(`components.${index}.carrouselComponent.urls.${k}` as const)} />
            </div>
            <Button isIconOnly color="danger" variant="light" onPress={() => removeCarrouselUrl(k)}>
              <LuTrash />
            </Button>
          </div>
        ))}
        <Button size="sm" onPress={() => appendCarrouselUrl("")}>Agregar URL</Button>
      </div>
    );
  };

  return (
    <Card className="mb-4 border border-default-200">
      <CardBody>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-default-100">
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="cursor-move touch-none"
              {...dragHandleProps}
            >
              <LuGripVertical className="text-default-400" size={20} />
            </Button>
            <div className="font-bold text-primary">{componentNames[type] || type}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <LuChevronUp /> : <LuChevronDown />}
            </Button>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => remove(index)}
            >
              <LuTrash />
            </Button>
          </div>
        </div>

        {isOpen && (
          <Tabs aria-label="Component options">
            <Tab key="content" title="Contenido">
              <div className="pt-2">
                {(() => {
                  switch (type) {
                    case "HERO": return renderHeroFields();
                    case "IMAGE": return renderImageFields();
                    case "CODE": return renderCodeFields();
                    case "NEXT_ARTICLE": return renderNextArticleFields();
                    case "DETAILS": return renderDetailsFields();
                    case "TIME_LINE": return renderTimeLineFields();
                    case "QUOTE": return renderQuoteFields();
                    case "TEXT": return renderTextFields();
                    case "QUESTIONS": return renderQuestionsFields();
                    case "STATS": return renderStatsFields();
                    case "IMAGE_CAPTION": return renderImageCaptionFields();
                    case "HEADER": return renderHeaderFields();
                    case "TESTIMONIALS": return renderTestimonialsFields();
                    case "CARROUSEL": return renderCarrouselFields();
                    default: return <div>Seleccione un tipo de componente válido.</div>;
                  }
                })()}
              </div>
            </Tab>
            <Tab key="settings" title="Ajustes">
              <div className="pt-2">
                <Input
                  label="Key (Opcional)"
                  {...register(`components.${index}.key`)}
                />
              </div>
            </Tab>
          </Tabs>
        )}
      </CardBody>
    </Card>
  );
};
