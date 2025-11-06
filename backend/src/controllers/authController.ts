import { Request, Response } from "express";
import { authRepo } from "../repositories/authRepository";

export async function verifyUserLogin(request: Request, response: Response) {
  const { idToken } = request.body;

  if (!idToken) {
    return response.status(400).json({ error: "ID token missing" });
  }
  try {
    const isValidToken = await authRepo.isValidIdToken(idToken);

    if (isValidToken) {
      return response.json({ validUser: true });
    } else {
      return response.status(401).json({
        error: "Could not verify id token",
        validUser: false,
      });
    }
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err });
  }
}
