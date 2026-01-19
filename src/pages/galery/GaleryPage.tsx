import { useAuth } from "@/components/providers/AuthContext";
import Load from "@/components/shared/load/Load";
import type {
  ApiResponse,
  ImageResponse,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { Button, Card, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";

export default function GaleryPage() {
  const { token } = useAuth();
  const { isLoading, data } = useQuery<ApiResponse<ImageResponse[]>>({
    queryKey: ["galery-images"],
    queryFn: async () => {
      const res = await instance.get("/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full h-full text-white">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Imágenes de la Galería</h1>
        <Button
          color="primary"
          className="font-semibold flex items-center gap-1"
        >
          <LuPlus />
          Nueva Imagen
        </Button>
      </header>

      <Load loading={isLoading} />
      <section className="w-full grid grid-cols-4 gap-2 mt-4">
        {data?.body.map((u) => (
          <Card isFooterBlurred className="border-none" radius="lg" key={u._id}>
            <Image src={u.url} />
          </Card>
        ))}
      </section>
    </div>
  );
}
