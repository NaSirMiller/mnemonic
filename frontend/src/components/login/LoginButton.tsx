import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { signInWithGoogle, LoginError } from "../../pages/login/login_utils";

type LoginButtonProps = {
  className?: string;
  onError?: (messag: string) => void;
};

export function LoginButton({ className, onError }: LoginButtonProps) {
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
      const message =
        error instanceof LoginError || error instanceof Error
          ? error.message
          : "Unknown error during login";

      if (onError) onError(message);
      else alert(message);
    }
  };

  return (
    <div className={className} onClick={handleGoogleLogin}>
      Sign in with Google
    </div>
  );
}
