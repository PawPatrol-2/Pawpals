import express from "express";
import usersRouter from "./routes/users";
import animalsRouter from "./routes/animals";
import applicationsRouter from "./routes/applications";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/animals", animalsRouter);
app.use("/api/applications", applicationsRouter);
export default app;
