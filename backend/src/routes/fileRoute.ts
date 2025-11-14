// src/routes/fileRoute.ts
import { Router } from "express";
import {
  getFile,
  createFile,
  editFile,
  deleteFile,
} from "../controllers/fileController";
export const fileRouter = Router();

fileRouter.get("/:fileId", getFile);
fileRouter.delete("/:fileId", deleteFile);
fileRouter.put("/:fileId", editFile);
fileRouter.post("/", createFile);
