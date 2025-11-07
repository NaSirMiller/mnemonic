import { createContext, useState, useMemo, type ReactNode } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../firebase_utils";

export type AuthContextType = {
  uid: string | null;
  setUid: (uid: string | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // Logout function
  const logout = async () => {
    try {
      // Firebase sign out
      await signOut(firebaseAuth);

      // Clear local state
      setUid(null);
      setAccessToken(null);

      console.log("User logged out successfully");
    } catch (err) {
      console.error("Error logging out:", err);
      // Still clear local state
      setUid(null);
      setAccessToken(null);
    }
  };

  //memoized context value
  const value = useMemo(
    () => ({ uid, setUid, accessToken, setAccessToken, logout }),
    [uid, accessToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
