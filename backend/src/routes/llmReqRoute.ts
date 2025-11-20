import { Router } from "express";
import {
  getProposedCourseInfo,
  getTasksList,
} from "../controllers/llmReqController";
export const llmRouter = Router();

llmRouter.post("/courses", getProposedCourseInfo);
llmRouter.post("/tasksList", getTasksList);
