import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthorized: boolean =
    localStorage.getItem("userIsAuthenticated") === "true";

  return isAuthorized ? children : <Navigate to="/auth" />;
}
