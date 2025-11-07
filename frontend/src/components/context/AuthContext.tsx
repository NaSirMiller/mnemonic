import { createContext, useState, type ReactNode } from "react";

export type AuthContextType = {
  uid: string | null;
  setUid: (uid: string | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ uid, setUid, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
