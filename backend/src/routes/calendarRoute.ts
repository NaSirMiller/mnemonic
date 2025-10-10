import { Router } from "express";
import { listEvents } from "../controllers/calendarController";

export const calendarRouter = Router();

calendarRouter.post("/list", listEvents);

