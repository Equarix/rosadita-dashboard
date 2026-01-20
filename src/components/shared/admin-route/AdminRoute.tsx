import { useAuth } from "@/components/providers/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router";

export default function AdminRoute({ children }: PropsWithChildren) {
  const { user } = useAuth();

  if (user?.role != "admin") {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
