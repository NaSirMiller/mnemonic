import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onIdTokenChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase_utils";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async user => {
      if (user) {
        try {
          // The token is refreshed internally
          await user.getIdToken(true);
          setIsAuthorized(true);
        } catch (error) {
          console.error("Failed to refresh ID token:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthorized === null) return null;

  return isAuthorized ? <>{children}</> : <Navigate to="/auth" replace />;
}
