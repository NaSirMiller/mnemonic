import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { signInWithGoogle, LoginError } from "../pages/login/Login";
import "./SignIn.css";

export const LoginButton = () => {
  const { setUid, setAccessToken } = useAuth();
  const [, setIsAuthorized] = useState<boolean | null>(null);
  const handleGoogleLogin = async () => {
    try {
      const { user, googleAccessToken } = await signInWithGoogle();

      // Store UID and access token in context
      setUid(user.uid);
      setAccessToken(googleAccessToken);
      setIsAuthorized(true);
      console.log("Login successful", user.uid, googleAccessToken);
    } catch (error) {
      if (error instanceof LoginError) {
        alert(`Login error: ${error.message}`);
      } else if (error instanceof Error) {
        alert(`Unexpected error: ${error.message}`);
      } else {
        alert("Unknown error during login");
      }
    }
  };

  return (
    <div className="signin-page-button" onClick={handleGoogleLogin}>
      Sign in with Google
    </div>
  );
};
