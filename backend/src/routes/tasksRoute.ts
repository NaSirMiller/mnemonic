import { Router } from "express";
import {
  createUserTask,
  getUserTasks,
  updateUserTask,
  deleteUserTask,
} from "../controllers/tasksController";
export const tasksRouter = Router();

tasksRouter.post("/", createUserTask);
tasksRouter.get("/:userId", getUserTasks); // taskId is an optional query parameter
tasksRouter.put("/:userId/:taskId", updateUserTask);
tasksRouter.delete("/:userId/:taskId", deleteUserTask);
