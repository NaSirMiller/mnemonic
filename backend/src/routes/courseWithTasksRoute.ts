import { Router } from "express";

import { createCourseWithTasks } from "../controllers/coursesWithTasksController";

export const courseWithTasksRouter = Router();

courseWithTasksRouter.post("/", createCourseWithTasks);
