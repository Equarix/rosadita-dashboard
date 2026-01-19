import { useAuth } from "@/components/providers/AuthContext";
import type { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children ? children : <Outlet />;
}
