import { Router } from "express";
import {
  createUserTask,
  getUserTask,
  updateUserTask,
  deleteUserTask,
} from "../controllers/tasksController";
export const tasksRouter = Router();

tasksRouter.post("/", createUserTask);
tasksRouter.get("/:userId", getUserTask);
tasksRouter.put("/:userId", updateUserTask);
tasksRouter.delete("/:userId", deleteUserTask);
