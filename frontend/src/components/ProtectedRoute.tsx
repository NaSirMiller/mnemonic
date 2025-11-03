import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onIdTokenChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase_utils";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { setUid, setAccessToken } = useAuth();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async user => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true); // refresh token
          setUid(user.uid);
          setAccessToken(idToken);
          setIsAuthorized(true);
        } catch (error) {
          console.error("Failed to refresh ID token:", error);
          setUid(null);
          setAccessToken(null);
          setIsAuthorized(false);
        }
      } else {
        setUid(null);
        setAccessToken(null);
        setIsAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, [setUid, setAccessToken]);

  if (isAuthorized === null) return null; // or a loading spinner

  return isAuthorized ? <>{children}</> : <Navigate to="/auth" replace />;
}
