import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar.events");
googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");
export { firebaseApp, firebaseAuth, googleProvider };
