import { Router } from "express";
import {
  createUserTask,
  getUserTasks,
  updateUserTask,
  deleteUserTask,
} from "../controllers/tasksController";
export const tasksRouter = Router();

tasksRouter.post("/", createUserTask);
tasksRouter.get("/:userId", getUserTasks);
tasksRouter.put("/:userId", updateUserTask);
tasksRouter.delete("/:userId/:taskId", deleteUserTask);
