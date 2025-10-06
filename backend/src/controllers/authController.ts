import { Request, Response } from "express";

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
