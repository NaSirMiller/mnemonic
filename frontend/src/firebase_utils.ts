import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  type UserCredential,
  OAuthCredential,
} from "firebase/auth";

const {
  VITE_FIREBASE_API_KEY: firebaseApiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseAuthDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseProjectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseStorageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseMessagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseAppId,
} = import.meta.env;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// Request full calendar access (read + write)
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar");

setPersistence(firebaseAuth, browserLocalPersistence).catch((error) => {
  console.error("Error setting Firebase auth persistence:", error);
});

export async function signInWithGoogle(): Promise<{
  userCredential?: UserCredential;
  googleAccessToken?: string | null;
  error?: unknown;
}> {
  try {
    const userCredential = await signInWithPopup(firebaseAuth, googleProvider);
    const oauthCredential = GoogleAuthProvider.credentialFromResult(
      userCredential
    ) as OAuthCredential | null;

    const accessToken = oauthCredential?.accessToken ?? null;
    return { userCredential, googleAccessToken: accessToken };
  } catch (error) {
    console.error("Google sign-in failed:", error);
    return { error };
  }
}

export { firebaseApp, firebaseAuth, googleProvider };
