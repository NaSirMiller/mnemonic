import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoginButton } from "../../components/login/LoginButton";

import "../../style.css";
import "./SignIn.css";

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
    toast.error(message);
  };

  return (
    <div className="signin-page">
      <div className="signin-page-title">Welcome to Mnemonic!</div>
      <div className="signin-page-description">
        Our app connects to your Google Calendar and uses AI to prioritize your
        tasks and assignments. No more juggling deadlines: just open Mnemonic
        and see exactly what to tackle next.
      </div>
      <LoginButton className="signin-page-button" onError={handleError} />
      {errorMessage && <div className="login-error">{errorMessage}</div>}
    </div>
  );
}
