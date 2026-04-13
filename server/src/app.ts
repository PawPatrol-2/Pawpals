import express from "express";
import usersRouter from "./routes/users";
import animalsRouter from "./routes/animals";
import cors from "cors";
import path from "node:path";

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/users", usersRouter);
app.use("/api/animals", animalsRouter);

export default app;
