// src/routes/authRoutes.ts
import { Router } from "express";
import {
  verifyIdToken,
  getAccessToGoogleCalendar,
  handleGoogleCallback,
  refreshAccessToken,
} from "../controllers/authController";
export const authRouter = Router();

authRouter.post("/verifyIdToken", verifyIdToken);
authRouter.get("/google/connect", getAccessToGoogleCalendar);
authRouter.get("/google/callback", handleGoogleCallback);
authRouter.post("refreshAccessToken", refreshAccessToken);
