import { Request, Response } from "express";
import { google } from "googleapis";

import { authRepo } from "../repositories/authRepository";

const BASE_URL: string = "http://localhost:5000/api/auth";
const FRONTEND_URL: string = "http://localhost:5173";
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${BASE_URL}/auth/google/callback`
);

export async function verifyIdToken(
  req: Request,
  res: Response
): Promise<Response> {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token missing" });
  }

  try {
    const isValidToken = await authRepo.isValidIdToken(idToken);

    if (isValidToken) {
      return res.json({ validUser: true });
    } else {
      return res.status(401).json({
        error: "Could not verify ID token",
        validUser: false,
      });
    }
  } catch (err) {
    console.error("Error verifying ID token:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export function getAccessToGoogleCalendar(req: Request, res: Response): void {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).send("Missing userId");
    return;
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // ensures refresh token is returned
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: userId as string,
  });

  res.redirect(url);
}
export async function handleGoogleCallback(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { code, state: userId } = req.query;
    if (!code || !userId) {
      res.status(400).json({ error: "Missing code or userId." });
      return;
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    if (!tokens.refresh_token) {
      console.warn("No refresh token returned (was consent prompt shown?)");
    }

    // Store refresh token in Firestore.
    await authRepo.updateUser(userId as string, {
      refreshToken: tokens.refresh_token ?? null,
    });

    res.redirect(FRONTEND_URL); // Redirect back to frontend
  } catch (err) {
    console.error("Google OAuth callback error: ", err);
    res.status(500).json({ error: "Google OAuth failed." });
  }
}

//Refresh access token

export async function refreshAccessToken(request: Request, response: Response) {
  const { userId } = request.body;
  if (!userId) return response.status(400).json({ message: "userId required" });
  try {
    const accessToken = await authRepo.refreshAccessToken(userId);
    response.status(200).json({ accessToken: accessToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(err);
    response.status(400).json({ message: message });
  }
}
