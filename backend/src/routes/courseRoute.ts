import { Router } from "express";

import {
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController";

export const courseRouter = Router();

courseRouter.post("/", createCourse);
courseRouter.get("/:userId", getCourse);
courseRouter.put("/:userId/:courseId", updateCourse);
courseRouter.delete("/:userId/:courseId", deleteCourse);
