import { Request, Response } from "express";
import { firebaseRepo } from "../repositories/firebaseRepository";

export async function verifyUserLogin(request: Request, response: Response) {
  const { idToken } = request.body;

  if (!idToken) {
    return response.status(400).json({ error: "ID token missing" });
  }
  let isValidToken: boolean;
  isValidToken = await firebaseRepo.isValidIdToken(idToken);
  if (isValidToken) {
    return response.json({
      validUser: true,
    });
  }
  return response
    .status(401)
    .json({ messge: "Could not verify id token", validUser: false });
}
