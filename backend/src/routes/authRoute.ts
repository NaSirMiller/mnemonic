// src/routes/authRoutes.ts
import { Router } from "express";
import { verifyUserLogin } from "../controllers/authController";
import { connectGoogle, handleGoogleCallback } from "../auth/google/connect";
import { firebaseRepo } from "../repositories/firebaseRepository";

export const authRouter = Router();

authRouter.post("/verifyIdToken", verifyUserLogin);
authRouter.get("/google/connect", connectGoogle);
authRouter.get("/google/callback", handleGoogleCallback);

//Refresh access token
authRouter.post("/refresh-token", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });
  try {
    const accessToken = await firebaseRepo.refreshAccessToken(userId);
    res.status(200).json({ accessToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error(err);
    res.status(400).json({ message });
  }
});
