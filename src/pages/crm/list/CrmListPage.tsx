import { useState, useMemo } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import type {
  ApiResponse,
  CrmCategoryResponse,
  EnterpriseResponse,
  EnterpriseTracking,
  PaginatedApiResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { RenderLuIcon } from "@/utils/iconHelper";
import UploadEnterprisesModal from "@/module/crm/upload-enterprises/UploadEnterprisesModal";
import CreateTrackingModal from "@/module/crm/create-tracking/CreateTrackingModal";
import UpdateTrackingModal from "@/module/crm/update-tracking/UpdateTrackingModal";
import AlertDeleteTrackingModal from "@/module/crm/alert-delete-tracking/AlertDeleteTrackingModal";
import UpdateEnterpriseModal from "@/module/crm/update-enterprise/UpdateEnterpriseModal";
import AlertDeleteEnterpriseModal from "@/module/crm/alert-delete-enterprise/AlertDeleteEnterpriseModal";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { FaWhatsapp } from "react-icons/fa";
import {
  LuActivity,
  LuBuilding2,
  LuClock,
  LuExternalLink,
  LuMapPin,
  LuMessageSquare,
  LuPhone,
  LuPlus,
  LuSearch,
  LuStar,
  LuCloudUpload,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";

export default function CrmListPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTrackingStatus, setSelectedTrackingStatus] = useState<string>("");
  const [selectedEnterprise, setSelectedEnterprise] =
    useState<EnterpriseResponse | null>(null);

  const {
    isOpen: isUploadOpen,
    onOpen: onOpenUpload,
    onOpenChange: onOpenChangeUpload,
  } = useDisclosure();

  const {
    isOpen: isTrackingOpen,
    onOpen: onOpenTracking,
    onOpenChange: onOpenChangeTracking,
  } = useDisclosure();

  const [selectedTrackingToEdit, setSelectedTrackingToEdit] =
    useState<EnterpriseTracking | null>(null);
  const [selectedTrackingToDelete, setSelectedTrackingToDelete] =
    useState<number | null>(null);

  const {
    isOpen: isUpdateTrackingOpen,
    onOpen: onOpenUpdateTracking,
    onOpenChange: onOpenChangeUpdateTracking,
  } = useDisclosure();

  const {
    isOpen: isDeleteTrackingOpen,
    onOpen: onOpenDeleteTracking,
    onOpenChange: onOpenChangeDeleteTracking,
  } = useDisclosure();

  const {
    isOpen: isUpdateEnterpriseOpen,
    onOpen: onOpenUpdateEnterprise,
    onOpenChange: onOpenChangeUpdateEnterprise,
  } = useDisclosure();

  const {
    isOpen: isDeleteEnterpriseOpen,
    onOpen: onOpenDeleteEnterprise,
    onOpenChange: onOpenChangeDeleteEnterprise,
  } = useDisclosure();

  const getTrackingStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { label: "Pendiente", color: "warning" as const };
      case "IN_PROGRESS":
        return { label: "En Progreso", color: "primary" as const };
      case "ANSWERED":
        return { label: "Respondido", color: "secondary" as const };
      case "COMPLETED":
        return { label: "Completado", color: "success" as const };
      case "CANCELLED":
        return { label: "Cancelado", color: "danger" as const };
      default:
        return { label: status || "Pendiente", color: "default" as const };
    }
  };

  // Fetch Categories for filter dropdown
  const { data: categoriesData } = useQuery<
    ApiResponse<CrmCategoryResponse[]>
  >({
    queryKey: ["crm-categories"],
    queryFn: async () => {
      const res = await instance.get("/crm-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Fetch Enterprises
  const { data: enterprisesData, isLoading, refetch } = useQuery<
    PaginatedApiResponse<EnterpriseResponse[]>
  >({
    queryKey: ["crm-enterprises", page, search, selectedCategory, selectedTrackingStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);
      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (selectedTrackingStatus) params.append("trackingStatus", selectedTrackingStatus);

      const res = await instance.get(`/crm?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const enterprises = enterprisesData?.body || [];
  const metadata = enterprisesData?.metadata;
  const categories = categoriesData?.body || [];

  // Automatically select the first enterprise if current selection is not in list
  const activeEnterprise = useMemo(() => {
    if (selectedEnterprise) {
      const found = enterprises.find(
        (e) => e.enterpriseId === selectedEnterprise.enterpriseId
      );
      if (found) return found;
    }
    return enterprises[0] || null;
  }, [enterprises, selectedEnterprise]);

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return "EP";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-[calc(100vh-2rem)] p-0 overflow-hidden">
      <UploadEnterprisesModal
        isOpen={isUploadOpen}
        onClose={onOpenChangeUpload}
        onSuccess={() => refetch()}
      />

      {activeEnterprise && (
        <CreateTrackingModal
          isOpen={isTrackingOpen}
          onClose={onOpenChangeTracking}
          onSuccess={() => refetch()}
          enterpriseId={activeEnterprise.enterpriseId}
          enterpriseName={activeEnterprise.name}
        />
      )}

      <UpdateTrackingModal
        isOpen={isUpdateTrackingOpen}
        onClose={onOpenChangeUpdateTracking}
        onSuccess={() => refetch()}
        tracking={selectedTrackingToEdit}
        enterpriseName={activeEnterprise?.name}
      />

      <AlertDeleteTrackingModal
        isOpen={isDeleteTrackingOpen}
        onClose={onOpenChangeDeleteTracking}
        onSuccess={() => refetch()}
        trackingId={selectedTrackingToDelete}
      />

      <UpdateEnterpriseModal
        isOpen={isUpdateEnterpriseOpen}
        onClose={onOpenChangeUpdateEnterprise}
        onSuccess={() => refetch()}
        enterprise={activeEnterprise}
      />

      <AlertDeleteEnterpriseModal
        isOpen={isDeleteEnterpriseOpen}
        onClose={onOpenChangeDeleteEnterprise}
        onSuccess={() => {
          setSelectedEnterprise(null);
          refetch();
        }}
        enterpriseId={activeEnterprise?.enterpriseId || null}
        enterpriseName={activeEnterprise?.name}
      />

      {/* LEFT PANEL: Master List */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-3 h-full bg-background border border-default-200/80 rounded-2xl p-3 shrink-0 shadow-sm">
        {/* Panel Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Empresas</h2>
            <Chip size="sm" color="primary" variant="flat" className="font-semibold">
              {metadata?.totalItems || enterprises.length}
            </Chip>
          </div>

          <Tooltip content="Carga masiva desde CSV" color="primary">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={onOpenUpload}
              className="font-semibold flex items-center gap-1"
            >
              <LuCloudUpload className="size-4" />
              <span>Carga Masiva</span>
            </Button>
          </Tooltip>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Buscar por nombre o dirección..."
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            startContent={<LuSearch className="text-default-400 size-4" />}
            isClearable
            onClear={() => setSearch("")}
            size="sm"
            radius="lg"
          />

          <div className="grid grid-cols-2 gap-2">
            <Select
              placeholder="Categoría"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              size="sm"
              radius="lg"
              aria-label="Filtrar por categoría"
            >
              {categories.map((cat) => (
                <SelectItem key={cat.categoryEnterpriseId.toString()} textValue={cat.name}>
                  <div className="flex items-center gap-2">
                    <RenderLuIcon name={cat.icon} className="size-4 text-primary" />
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder="Seguimiento"
              selectedKeys={selectedTrackingStatus ? [selectedTrackingStatus] : []}
              onChange={(e) => {
                setSelectedTrackingStatus(e.target.value);
                setPage(1);
              }}
              size="sm"
              radius="lg"
              aria-label="Filtrar por estado de seguimiento"
            >
              <SelectItem key="PENDING" textValue="Pendiente">
                Pendiente
              </SelectItem>
              <SelectItem key="ANSWERED" textValue="Respondido">
                Respondido
              </SelectItem>
              <SelectItem key="IN_PROGRESS" textValue="En Progreso">
                En Progreso
              </SelectItem>
            </Select>
          </div>
        </div>


        {/* Enterprise List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Spinner size="md" color="primary" />
              <p className="text-xs text-default-400">Cargando empresas...</p>
            </div>
          ) : enterprises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-default-400 gap-2">
              <LuBuilding2 className="size-8 text-default-300" />
              <p className="text-sm font-medium">No hay empresas encontradas</p>
            </div>
          ) : (
            enterprises.map((item) => {
              const isSelected =
                activeEnterprise?.enterpriseId === item.enterpriseId;
              return (
                <div
                  key={item.enterpriseId}
                  onClick={() => setSelectedEnterprise(item)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border text-left flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-primary bg-primary-50/30 dark:bg-primary-950/20 shadow-sm"
                      : "border-default-100 hover:border-default-300 hover:bg-default-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-primary">
                      ID: {item.enterpriseId}
                    </span>
                    {item.category && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="text-[10px] h-5 px-1.5"
                      >
                        <div className="flex items-center gap-1">
                          <RenderLuIcon name={item.category.icon} className="size-3" />
                          <span>{item.category.name}</span>
                        </div>
                      </Chip>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-foreground line-clamp-1">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-default-500">
                    <div className="flex items-center gap-1">
                      <LuStar className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{item.stars || "0.0"}</span>
                      <span>({item.reviewCount || 0})</span>
                    </div>

                    {item.trackings && item.trackings.length > 0 ? (
                      <Chip size="sm" color="success" variant="dot" className="text-[10px] border-none h-4">
                        Seguimiento ({item.trackings.length})
                      </Chip>
                    ) : (
                      <span className="text-[10px] text-default-400">Sin seguimiento</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {metadata && metadata.totalPages > 1 && (
          <div className="pt-2 border-t border-default-100 flex justify-center">
            <Pagination
              total={metadata.totalPages}
              page={page}
              onChange={setPage}
              size="sm"
              color="primary"
              variant="flat"
            />
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Enterprise Details */}
      <div className="flex-1 h-full overflow-y-auto bg-background border border-default-200/80 rounded-2xl p-4 md:p-6 flex flex-col gap-5 shadow-sm">
        {activeEnterprise ? (
          <>
            {/* Header Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-4">
                <Avatar
                  name={getInitials(activeEnterprise.name)}
                  className="w-14 h-14 text-lg font-bold bg-primary text-white shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                      {activeEnterprise.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-default-500 mt-1">
                    <span className="font-mono font-semibold text-primary">
                      ID EMPRESA: {activeEnterprise.enterpriseId}
                    </span>
                    {activeEnterprise.category && (
                      <span className="flex items-center gap-1 font-medium bg-background px-2 py-0.5 rounded-full border border-default-200">
                        <RenderLuIcon name={activeEnterprise.category.icon} className="size-3 text-primary" />
                        {activeEnterprise.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                {activeEnterprise.urlGoogleMaps && (
                  <Button
                    as="a"
                    href={activeEnterprise.urlGoogleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                    variant="solid"
                    size="sm"
                    className="font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    <LuExternalLink className="size-4" />
                    Google Maps
                  </Button>
                )}

                {activeEnterprise.phone && (
                  <>
                    <Button
                      as="a"
                      href={`https://wa.me/${activeEnterprise.phone.replace(/[^0-9]/g, "")}${
                        activeEnterprise.category?.speach
                          ? `?text=${encodeURIComponent(
                              activeEnterprise.category.speach.replace(/<[^>]*>/g, "").trim()
                            )}`
                          : ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="success"
                      variant="solid"
                      size="sm"
                      className="font-semibold text-white bg-green-600 hover:bg-green-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <FaWhatsapp className="size-4" />
                      WhatsApp
                    </Button>

                    <Button
                      as="a"
                      href={`tel:${activeEnterprise.phone}`}
                      color="secondary"
                      variant="flat"
                      size="sm"
                      className="font-semibold flex items-center gap-1.5"
                    >
                      <LuPhone className="size-4" />
                      Llamar
                    </Button>
                  </>
                )}

                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={onOpenUpdateEnterprise}
                  aria-label="Editar empresa"
                >
                  <LuPencil className="size-4" />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={onOpenDeleteEnterprise}
                  aria-label="Eliminar empresa"
                >
                  <LuTrash2 className="size-4" />
                </Button>
              </div>
            </div>

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Información General */}
              <Card shadow="sm" className="border border-default-200/80">
                <CardHeader className="flex items-center gap-2 text-primary font-bold pb-2">
                  <LuBuilding2 className="size-5" />
                  <span>Información General</span>
                </CardHeader>
                <CardBody className="flex flex-col gap-3 text-sm pt-0">
                  <div>
                    <span className="text-xs uppercase text-default-400 font-semibold block">Dirección</span>
                    <div className="flex items-start gap-1.5 text-foreground font-medium mt-0.5">
                      <LuMapPin className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{activeEnterprise.address || "No registrada"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-default-100">
                    <div>
                      <span className="text-xs uppercase text-default-400 font-semibold block">Teléfono</span>
                      <span className="font-medium text-foreground">{activeEnterprise.phone || "No registrado"}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-default-400 font-semibold block">Calificación</span>
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <LuStar className="size-4 fill-amber-400" />
                        <span>{activeEnterprise.stars || "0.0"}</span>
                        <span className="text-xs text-default-400 font-normal">
                          ({activeEnterprise.reviewCount || 0} reseñas)
                        </span>
                      </div>
                    </div>
                  </div>

                  {activeEnterprise.website && (
                    <div className="pt-1 border-t border-default-100">
                      <span className="text-xs uppercase text-default-400 font-semibold block">Sitio Web</span>
                      <a
                        href={activeEnterprise.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-medium text-xs truncate block"
                      >
                        {activeEnterprise.website}
                      </a>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Card 2: Horarios de Atención */}
              <Card shadow="sm" className="border border-default-200/80">
                <CardHeader className="flex items-center justify-between text-primary font-bold pb-2">
                  <div className="flex items-center gap-2">
                    <LuClock className="size-5" />
                    <span>Horarios de Atención</span>
                  </div>
                  <Chip size="sm" variant="flat" color="default" className="text-xs">
                    {activeEnterprise.schedules?.length || 0} días
                  </Chip>
                </CardHeader>
                <CardBody className="pt-0">
                  {activeEnterprise.schedules && activeEnterprise.schedules.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {activeEnterprise.schedules.map((sched, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-default-100/60 dark:bg-default-50 p-2 rounded-lg text-xs"
                        >
                          <span className="font-semibold capitalize text-foreground">
                            {sched.day || "Día"}
                          </span>
                          <span className="text-default-500 font-mono">
                            {sched.hours || "Sin horario"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-default-400 italic">No hay horarios registrados</p>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Card 3: Historial de Seguimientos (Trackings) */}
            <Card shadow="sm" className="border border-default-200/80">
              <CardHeader className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <LuActivity className="size-5" />
                  <span>Historial de Seguimientos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Chip size="sm" color="primary" variant="flat" className="font-semibold">
                    {activeEnterprise.trackings?.length || 0} registros
                  </Chip>
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    onPress={onOpenTracking}
                    className="font-semibold flex items-center gap-1 text-xs"
                  >
                    <LuPlus className="size-3.5" />
                    <span>Nuevo</span>
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                {activeEnterprise.trackings && activeEnterprise.trackings.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {activeEnterprise.trackings.map((track) => (
                      <div
                        key={track.trackingId}
                        className="p-3 rounded-xl border border-default-200/70 bg-default-50/50 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Chip size="sm" color="primary" variant="flat" className="font-semibold">
                              {track.channel}
                            </Chip>
                            <Chip
                              size="sm"
                              color={track.answered ? "success" : "warning"}
                              variant="dot"
                              className="text-xs border-none"
                            >
                              {track.answered ? "Respondido" : "Sin respuesta"}
                            </Chip>
                          </div>

                          <div className="flex items-center gap-2">
                            {(() => {
                              const badge = getTrackingStatusBadge(track.status);
                              return (
                                <Chip
                                  size="sm"
                                  color={badge.color}
                                  variant="flat"
                                  className="text-[11px] font-semibold"
                                >
                                  {badge.label}
                                </Chip>
                              );
                            })()}
                            <span className="text-xs text-default-400 font-mono">
                              {track.date
                                ? new Date(track.date).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "-"}
                            </span>

                            <div className="flex items-center gap-0.5 ml-1">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="primary"
                                className="h-7 w-7 min-w-0"
                                onPress={() => {
                                  setSelectedTrackingToEdit(track);
                                  onOpenUpdateTracking();
                                }}
                              >
                                <LuPencil className="size-3.5" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                className="h-7 w-7 min-w-0"
                                onPress={() => {
                                  setSelectedTrackingToDelete(track.trackingId);
                                  onOpenDeleteTracking();
                                }}
                              >
                                <LuTrash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {track.notes && (
                          <div className="text-xs text-default-700 bg-background p-3 rounded-lg border border-default-100 prose prose-xs dark:prose-invert max-w-none">
                            <span className="font-semibold text-default-500 block text-[10px] uppercase mb-1">
                              Notas
                            </span>
                            <div dangerouslySetInnerHTML={{ __html: track.notes }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-default-400 gap-2 border border-dashed border-default-200 rounded-xl">
                    <LuMessageSquare className="size-6 text-default-300" />
                    <p className="text-sm font-medium">Sin seguimientos registrados para esta empresa</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center text-default-400 gap-3">
            <LuBuilding2 className="size-12 text-default-300" />
            <h3 className="text-lg font-semibold">Selecciona una empresa</h3>
            <p className="text-sm text-default-500 max-w-xs">
              Haz clic en cualquier empresa del listado de la izquierda para ver su información detallada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
