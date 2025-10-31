import { signInWithPopup, GoogleAuthProvider, type User } from "firebase/auth"; 
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, googleProvider } from "../firebase_utils";
import NavBar from "../components/NavBar/NavBar";
import "../style.css";
import { useAuth } from "../context/AuthContext"; // <-- import your AuthContext

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
  const { setAccessToken } = useAuth(); // <-- get setter from context

  async function getSignUpResponse() {
    console.log("Clicking sign-in button...");
    try {
      // Request email, profile, and Google Calendar access
      googleProvider.addScope("https://www.googleapis.com/auth/calendar");
      googleProvider.addScope("email");
      googleProvider.addScope("profile");

      // Sign in with Google
      const userCredentials = await signInWithPopup(firebaseAuth, googleProvider);
      const user: User = userCredentials.user;

      if (!user) {
        throw new LoginError(
          "User was not found upon sign in with Google!",
          "auth/user-not-found"
        );
      }

      // Get Firebase ID token (for backend verification)
      const idToken = await user.getIdToken();

      // SAFELY extract OAuth credentials (typed)
      const credential = GoogleAuthProvider.credentialFromResult(userCredentials);
      const googleAccessToken = credential?.accessToken ?? null;

      // Store access token in memory
      if (googleAccessToken) {
        console.log("Google OAuth Access Token:", googleAccessToken);
        setAccessToken(googleAccessToken);
      } else {
        console.warn("No Google OAuth access token found — check scope settings.");
      }

      // Placeholder for refresh token later
      // const refreshToken = (userCredentials as any)?._tokenResponse?.refreshToken ?? null;

      // Verify Firebase token on backend
      const verificationResponse = await fetch(
        "http://localhost:5000/api/auth/verifyIdToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      const verificationResult = await verificationResponse.json();

      if (verificationResult.validUser) {
        console.log("User verified by Firebase backend.");
        navigate("/");
      } else {
        console.log("User could not be verified by Firebase backend.");
      }
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

  return (
    <div className="login-page">
      <NavBar />
      <h2>Login Page</h2>
      <h3>Welcome to Mnemonic!</h3>
      <p>
        Mnemonic is a student-focused application, intending to help students succeed.
      </p>
      <div className="google-login-wrapper">
        <button onClick={getSignUpResponse}>Sign in with Google</button>
      </div>
    </div>
  );
}
