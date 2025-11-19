// src/routes/fileRoute.ts
import { Router } from "express";
import { upload } from "../middleware";
import {
  getFile,
  uploadFile,
  editFile,
  deleteFile,
} from "../controllers/fileController";
export const fileRouter = Router();

fileRouter.get("/:fileId", getFile);
fileRouter.delete("/:fileId", deleteFile);
fileRouter.put("/:fileId", editFile);
fileRouter.post("/", upload.single("file"), uploadFile);
