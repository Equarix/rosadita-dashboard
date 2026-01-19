import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { LuTrash } from "react-icons/lu";
import { cn } from "@/utils/cn";
import { listColor } from "@/utils/listColor";
import InputIcon from "@/components/shared/input/InputIcon";

interface BlogComponentFormProps {
  index: number;
  remove: (index: number) => void;
}

export const BlogComponentForm = ({
  index,
  remove,
}: BlogComponentFormProps) => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const type = watch(`components.${index}.type`);

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
      <Input
        label="Imagen URL"
        {...register(`components.${index}.heroComponent.image`)}
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
      <Input
        label="Imagen URL"
        {...register(`components.${index}.imageComponent.url`)}
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
    const {
      fields: detailFields,
      append: appendDetail,
      remove: removeDetail,
    } = useFieldArray({
      control,
      name: `components.${index}.detailsComponent`,
    });

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
    const {
      fields: timelineFields,
      append: appendItem,
      remove: removeItem,
    } = useFieldArray({
      control,
      name: `components.${index}.timeLineComponent`,
    });

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
                onPress={() => removeItem(k)}
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
            appendItem({
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
      <Input
        label="Imagen Usuario URL"
        {...register(`components.${index}.quoteComponent.userImage`)}
        errorMessage={getError("quoteComponent.userImage") as string}
      />
    </div>
  );

  return (
    <Card className="mb-4 border border-default-200">
      <CardBody>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-default-100">
          <div className="font-bold text-primary">{type} Component</div>
          <Button
            isIconOnly
            color="danger"
            variant="light"
            onPress={() => remove(index)}
          >
            <LuTrash />
          </Button>
        </div>

        {type === "HERO" && renderHeroFields()}
        {type === "IMAGE" && renderImageFields()}
        {type === "CODE" && renderCodeFields()}
        {type === "NEXT_ARTICLE" && renderNextArticleFields()}
        {type === "DETAILS" && renderDetailsFields()}
        {type === "TIME_LINE" && renderTimeLineFields()}
        {type === "QUOTE" && renderQuoteFields()}
      </CardBody>
    </Card>
  );
};
