import { HeroUIProvider, ToastProvider } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <BrowserRouter>{children}</BrowserRouter>
    </HeroUIProvider>
  );
}
