// src/routes/authRoutes.ts
import { Router } from "express";
import {
  verifyIdToken,
  connectGoogle,
  handleGoogleCallback,
  refreshAccessToken,
} from "../controllers/authController";
export const authRouter = Router();

authRouter.post("/verifyIdToken", verifyIdToken);
authRouter.get("/google/connect", connectGoogle);
authRouter.get("/google/callback", handleGoogleCallback);
authRouter.post("refreshAccessToken", refreshAccessToken);
