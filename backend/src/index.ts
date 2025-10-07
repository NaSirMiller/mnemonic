import express, { Application } from "express";
import cors from "cors";

import { authRouter } from "./routes/authRoute";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5175", //frontend
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request bodies

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
