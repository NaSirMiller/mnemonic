// src/routes/fileRoute.ts
import { Router } from "express";
import { upload } from "../middleware";
import { getDocText } from "../controllers/llmFileController";
export const fileRouter = Router();

fileRouter.post("/", upload.single("file"), getDocText);
