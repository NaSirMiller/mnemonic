import express, { Application } from "express";
import cors from "cors";

import { authRouter } from "./routes/authRoute";
import {  courseRouter } from "./routes/courseRoute";
import { tasksRouter } from "./routes/tasksRoute";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/tasks", tasksRouter);

export default app;
