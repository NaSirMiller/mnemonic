import { Router } from "express";
import { verifyUserLogin } from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/verifyIdToken", verifyUserLogin);
