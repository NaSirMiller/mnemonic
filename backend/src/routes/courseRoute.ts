import { Router } from "express";

import { getCourse, createCourse, deleteCourse, updateCourse } from "../controllers/courseController";

export const authRouter = Router();

authRouter.post("/", createCourse);
authRouter.get("/:userId", getCourse);
authRouter.put("/:userId", updateCourse);
authRouter.delete("/:userId/:coursename", deleteCourse)