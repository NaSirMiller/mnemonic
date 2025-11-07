import { signInWithPopup } from "firebase/auth";
import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { firebaseAuth, googleProvider } from "../../firebase_utils";
import {
  isValidIdToken,
  IdTokenVerificationError,
} from "../../services/authService";
import NavBar from "../../components/navbar/NavBar";
import "../style.css";
import { useState } from "react";

// toast.configure();

class LoginError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function getSignUpResponse() {
    console.log("User clicked sign-in button.");
    try {
      const userCredentials = await signInWithPopup(
        firebaseAuth,
        googleProvider
      );
      const user: User = userCredentials.user;
      if (!user) {
        console.log("User was not found upon sign in with Google!");
        throw new LoginError(
          "User was not found upon sign in with Google!",
          "auth/user-not-found"
        );
      }
      console.log("Retrieved id token, verifying now.");

      const idToken: string = await user.getIdToken();
      const validToken: boolean = await isValidIdToken(idToken);

      if (!validToken) {
        // The id token produced by Google or the use, is not valid
        toast.error("Could not verify your login. Please try again.");
        console.log("Could not verify your login. Please try again.");
        return;
      }
      console.log("User is authenticated, redirecting to homepage");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof IdTokenVerificationError || error instanceof Error) {
        console.error("Login error:", error.message);
        setErrorMessage(error.message);
        toast(errorMessage);
      } else {
        console.error("Unknown login error:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
        toast(errorMessage);
      }
    }
  }
  return (
    <div className="login-page">
      <NavBar />
      <h2>Login Page</h2>
      <h3>Welcome to Mnemonic!</h3>
      <p>
        Mnemonic is a student focused application, intending on helping students
        succeed.
      </p>
      <div className="google-login-wrapper">
        <button onClick={getSignUpResponse}>Sign in with Google</button>
        {errorMessage && <div className="login-error">{errorMessage}</div>}
      </div>
    </div>
  );
}
