// src/routes/authRoutes.ts
import { Router } from "express";
import { verifyUserLogin } from "../controllers/authController";
import { connectGoogle, handleGoogleCallback } from "../auth/google/connect";

export const authRouter = Router();

authRouter.post("/verifyIdToken", verifyUserLogin);
authRouter.get("/google/connect", connectGoogle);
authRouter.get("/google/callback", handleGoogleCallback);
