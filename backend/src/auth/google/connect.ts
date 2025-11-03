import { Request, Response } from "express";
import { google } from "googleapis";
import { firebaseRepo } from "../../repositories/firebaseRepository";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/api/auth/google/callback"
);

export const connectGoogle = (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).send("Missing userId");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // gives refresh token
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: userId as string,
  });

  res.redirect(url);
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state: userId } = req.query;
    if (!code || !userId) return res.status(400).send("Missing code or userId");

    const { tokens } = await oauth2Client.getToken(code as string);
    if (!tokens.refresh_token) {
      console.warn("No refresh token returned (was consent prompt shown?)");
    }

    // Store refresh token in Firestore
    await firebaseRepo.updateUser(userId as string, {
      refreshToken: tokens.refresh_token ?? null,
    });

    res.redirect("http://localhost:5173"); // back to frontend
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    res.status(500).send("Google OAuth failed");
  }
};
