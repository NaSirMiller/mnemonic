// src/components/ProtectedRoute.tsx
import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onIdTokenChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase_utils";
import { useAuth } from "../context/AuthContext";

// Helper: fetch fresh access token from backend
async function fetchFreshAccessToken(userId: string): Promise<string | null> {
  try {
    console.log("Fetching fresh access token for uid:", userId);
    const res = await fetch("http://localhost:5000/api/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error("Failed to refresh token");
    const data = await res.json();
    console.log("Backend returned access token.");
    return data.accessToken ?? null;
  } catch (err) {
    console.error("Error fetching access token:", err);
    return null;
  }
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { uid, setUid, accessToken, setAccessToken } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // On mount: listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          setUid(user.uid);

          // Fetch fresh token from backend
          const token = await fetchFreshAccessToken(user.uid);
          if (token) setAccessToken(token);

          setIsAuthorized(true);
        } catch (err) {
          console.error("ProtectedRoute error:", err);
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

  // Periodic refresh every hour
  useEffect(() => {
    if (!uid) return;

    const interval = setInterval(async () => {
      const token = await fetchFreshAccessToken(uid);
      if (token) {
        console.log("Refreshed access token.");
        setAccessToken(token);
      }
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [uid, setAccessToken]);

  // Block rendering until authorized AND token exists
  if (isAuthorized === null || !accessToken) return <div>Loading...</div>;

  return isAuthorized ? <>{children}</> : <Navigate to="/auth" replace />;
}
