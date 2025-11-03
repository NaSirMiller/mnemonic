import { signInWithPopup, GoogleAuthProvider, type User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseAuth, googleProvider } from "../firebase_utils";

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
}> {
  try {
    googleProvider.addScope("https://www.googleapis.com/auth/calendar");
    googleProvider.addScope("email");
    googleProvider.addScope("profile");

    const userCredentials = await signInWithPopup(firebaseAuth, googleProvider);
    const user: User = userCredentials.user;

    if (!user) {
      throw new LoginError("User not found upon Google sign-in!", "auth/user-not-found");
    }

    const idToken = await user.getIdToken();
    const credential = GoogleAuthProvider.credentialFromResult(userCredentials);
    const googleAccessToken = credential?.accessToken ?? null;

    // Backend verification
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
      throw new LoginError("User could not be verified by backend", "auth/verification-failed");
    }

    return { user, idToken, googleAccessToken };
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Google Sign-In Error:", error.code, error.message);
      throw new LoginError(`Error signing in user: ${error.message}`, error.code);
    } else if (error instanceof Error) {
      console.error("Login failed:", error.message);
      throw new LoginError(`Error signing in user: ${error.message}`, "unknown");
    } else {
      console.error("Unknown login error", error);
      throw new LoginError("Unknown error during login", "unknown");
    }
  }
}
