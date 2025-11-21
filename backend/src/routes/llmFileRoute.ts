// src/routes/fileRoute.ts
import { Router } from "express";
import { upload } from "../middleware";
import { sendFileAsHtml } from "../controllers/llmFileController";
export const fileRouter = Router();

fileRouter.post("/", upload.single("file"), sendFileAsHtml);
