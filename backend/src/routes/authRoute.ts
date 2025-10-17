import { Router } from "express";
import { verifyUserLogin, saveTokensToDatabase } from "../controllers/authController";
import dotenv from "dotenv";
import fetch from "node-fetch"; // or global fetch if on Node 18+
import admin from "../firebase_admin";
import { getCalendarEvents, isCalendarConnected } from "../controllers/calendarController";

dotenv.config();

export const authRouter = Router();

// Firebase ID token verification
authRouter.post("/verifyIdToken", verifyUserLogin);

// Redirect user to Google OAuth consent screen
authRouter.get("/google", async (req, res) => {
  const idToken = req.query.token as string; // get Firebase ID token
  if (!idToken) return res.status(400).send("Missing Firebase ID token");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid; // this is the Firebase UID

    const redirectUri = "http://localhost:5000/api/auth/google/callback";
    const scope =
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email";

    // Pass the UID in the 'state' param so we know which user is connecting in the callback
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&prompt=consent&scope=${encodeURIComponent(
      scope
    )}&state=${uid}`;

    res.redirect(url);
  } catch (err) {
    console.error("Invalid Firebase ID token", err);
    res.status(401).send("Invalid Firebase ID token");
  }
});

// Route handler for Google OAuth callback
authRouter.get("/google/callback", async (req, res) => {
  try {
    // Extract the authorization code from Google and the Firebase UID from state
    const code = req.query.code as string;       // temporary code from Google
    const uid = req.query.state as string;       // Firebase UID passed in the state

    // Ensure we have a valid UID
    if (!uid) return res.status(400).send("Missing UID in state");

    // Exchange the authorization code for access & refresh tokens from Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,                                     
        client_id: process.env.GOOGLE_CLIENT_ID!, 
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: "http://localhost:5000/api/auth/google/callback",
        grant_type: "authorization_code",        
      }),
    });

    // Parse the response to get tokens
    const tokens = (await tokenResponse.json()) as {
      access_token: string;       // short-lived token to access Google APIs
      refresh_token?: string;     // long-lived token to get new access tokens
      expires_in: number;         
      token_type: string;
      scope: string;
      id_token?: string;
    };

    // Log tokens for debugging (remove in production)
    console.log("Google OAuth tokens:", tokens);

    // Save the tokens to your database associated with the Firebase UID for access later
    await saveTokensToDatabase(uid, tokens.refresh_token, tokens.access_token);

    // Redirect the user back to the frontend with a success indicator
    res.redirect("http://localhost:5173/?calendar_connected=true");
  } catch (error) {
    // Handle any errors during the OAuth process
    console.error("Error during Google OAuth callback:", error);
    res.status(500).send("Failed to connect Google Calendar");
  }
});


// Add routes for getCalendarEvents and isCalendarConnected
authRouter.post("/calendar/events", getCalendarEvents);
authRouter.post("/calendar/connected", isCalendarConnected);
