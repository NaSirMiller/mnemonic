import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onIdTokenChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase_utils";
import { useAuth } from "../context/AuthContext";

// Helper: fetch fresh access token from backend
async function fetchFreshAccessToken(userId: string): Promise<string | null> {
  // DEV BYPASS: return fake token if skip-auth enabled
  if (import.meta.env.VITE_SKIP_AUTH === "true") {
    return "dev-access-token";
  }

  try {
    console.log("Fetching fresh access token");
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

  useEffect(() => {
    // DEV BYPASS: skip Firebase + backend auth
    if (import.meta.env.VITE_SKIP_AUTH === "true") {
      const devUid = "dev-123";
      const devToken = "dev-access-token";
      setUid(devUid);
      setAccessToken(devToken);
      setIsAuthorized(true);
      console.log("DEV: bypassing auth (VITE_SKIP_AUTH=true)");
      return; // stop the normal auth flow
    }

    // Normal Firebase auth listener
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

  // Render logic
  if (isAuthorized === null) return <div>Loading...</div>;
  if (!isAuthorized || !accessToken) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}
