import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Implement authorization check
  const isAuthorized: boolean = false;

  return isAuthorized ? children : <Navigate to="/auth" />;
}
