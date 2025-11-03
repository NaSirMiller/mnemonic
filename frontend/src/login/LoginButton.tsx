// src/components/LoginButton.tsx
import { useAuth } from "../context/AuthContext";
import { signInWithGoogle, LoginError } from "./Login";

export const LoginButton = () => {
  const { setUid, setAccessToken } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const { user, googleAccessToken } = await signInWithGoogle();

      // Store UID and access token in context
      setUid(user.uid);
      setAccessToken(googleAccessToken);

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

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
};
