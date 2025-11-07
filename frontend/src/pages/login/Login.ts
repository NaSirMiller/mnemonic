import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseAuth, googleProvider } from "../../firebase_utils";

export class LoginError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}

export async function signInWithGoogle(): Promise<{
  user: User;
  idToken: string;
  googleAccessToken: string | null;
  googleIdToken: string | null;
}> {
  try {
    // Add scopes and force consent
    googleProvider.addScope("https://www.googleapis.com/auth/calendar");
    googleProvider.addScope("email");
    googleProvider.addScope("profile");
    googleProvider.setCustomParameters({ prompt: "consent" });

    // Sign in via popup
    const userCredentials = await signInWithPopup(firebaseAuth, googleProvider);
    const user: User = userCredentials.user;
    if (!user) {
      console.log("User was not found upon sign in with Google!");
      throw new LoginError(
        "User was not found upon sign in with Google!",
        "auth/user-not-found"
      );
    }

    // Firebase ID token
    const idToken = await user.getIdToken();

    // Google OAuth credentials from Firebase (access token only)
    const credential = GoogleAuthProvider.credentialFromResult(userCredentials);
    const googleAccessToken = credential?.accessToken ?? null;
    const googleIdToken = credential?.idToken ?? null;

    // Verify ID token with backend
    const verificationResponse = await fetch(
      "http://localhost:5000/api/auth/verifyIdToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    const verificationResult = await verificationResponse.json();
    if (!verificationResult.validUser) {
      throw new LoginError(
        "User could not be verified by backend",
        "auth/verification-failed"
      );
    }

    // redirect to backend endpoint to exchange for refresh token
    window.location.href = `http://localhost:5000/api/auth/google/connect?userId=${user.uid}`;

    return { user, idToken, googleAccessToken, googleIdToken };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Google Sign-In Error:", error.code, error.message);
      throw new LoginError(
        `Error signing in user: ${error.message}`,
        error.code
      );
    } else if (error instanceof Error) {
      console.error("Login failed:", error.message);
      throw new LoginError(
        `Error signing in user: ${error.message}`,
        "unknown"
      );
    } else {
      console.error("Unknown login error", error);
      throw new LoginError("Unknown error during login", "unknown");
    }
  }
}
