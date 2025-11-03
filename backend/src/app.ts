import express, { Application } from "express";
import cors from "cors";

import { authRouter } from "./routes/authRoute";
import { tasksRouter } from "./routes/tasksRoute";
import { userRouter } from "./routes/userRoute";


const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", userRouter);

export default app;
