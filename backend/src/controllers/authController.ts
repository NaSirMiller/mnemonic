import { Request, Response } from "express";
import { db } from "../firebase_admin";

import admin from "../firebase_admin";

export async function verifyUserLogin(request: Request, response: Response) {
  const { idToken } = request.body;

  if (!idToken) {
    return response.status(400).json({ error: "ID token missing" });
  }

  try {
    await admin.auth().verifyIdToken(idToken, true);
    return response.json({
      validUser: true,
    });
  } catch (error) {
    console.error(error);
    return response.status(401).json({ error: error, validUser: false });
  }
}

// Function used to save Google OAuth access tokens to Firestore
export async function saveTokensToDatabase(
  userId: string,
  refreshToken?: string,
  accessToken?: string
): Promise<void> {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.set(
      {
        googleTokens: {
          refreshToken: refreshToken ?? null,
          accessToken: accessToken ?? null,
          updatedAt: new Date().toISOString(),
        },
      },
      { merge: true } 
    );

    console.log('Tokens saved for user ${userId}');
  } catch (error) {
    console.error("Error saving tokens:", error);
    throw error;
  }
}