import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { firebaseAuth, googleProvider } from "../firebase_utils";
import "../style.css";

class LoginError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}

export function LoginPage() {
  async function getSignUpResponse() {
    console.log("Clicking sign-in button...");
    try {
      const userCredentials = await signInWithPopup(
        firebaseAuth,
        googleProvider,
      );
      const user: User = userCredentials.user;
      if (!user) {
        console.log("User was not found upon sign in with Google!");
        throw new LoginError(
          "User was not found upon sign in with Google!",
          "auth/user-not-found",
        );
      }

      const idToken = await user.getIdToken();

      const verificationResponse = await fetch(
        "http://localhost:5000/api/auth/verifyIdToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        },
      );

      const verificationResult = await verificationResponse.json();

      try {
        if (verificationResult.validUser) {
          console.log("User was verified by firebase.");
          localStorage.setItem("userIsAuthenticated", JSON.stringify(true));
          navigate("/");
        }
        console.log("User could not be verified by firebase.");
        return null;
      } catch (error) {
        console.log(`Error while calling api: ${error}`);
        throw new LoginError(
          `Error while calling api: ${error}`,
          "auth/api-response-format",
        );
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Google Sign-In Error:", error.code, error.message);
        throw new LoginError(
          `Error signing in user: ${error.message}`,
          error.code,
        );
      } else if (error instanceof Error) {
        console.error("Login failed:", error.message);
        throw new LoginError(
          `Error signing in user: ${error.message}`,
          "unknown",
        );
      } else {
        console.error("Unknown login error", error);
        throw new LoginError("Unknown error during login", "unknown");
      }
    }
  }
  const navigate = useNavigate();

  return (
    <div className="login-page-container">
      {/* navbar removed */}
      
      {/* main heading? */}
      <h1>Welcome to Mnemonic!</h1>
      <p>
        Mnemonic is a student focused application, intending on helping students
        succeed.
      </p>
      <div className="google-login-wrapper">
        {/* using blue button style */}
        <button className="google-signin-button" onClick={getSignUpResponse}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}