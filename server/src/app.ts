<<<<<<< HEAD
import express from "express";
import usersRouter from "./routes/users";
import animalsRouter from "./routes/animals";
import cors from "cors";
import path from "node:path";
=======
import express from 'express';
import usersRouter from './routes/users';
import animalsRouter from './routes/animals';
import organisationsRouter from './routes/Organisations';
import applicationsRouter from './routes/applications';
import cors from 'cors';
import { login } from './controllers/userController';
>>>>>>> 96331b38fe30c44ae8cea39f570322dac102534f

const app = express();

app.use(cors());
<<<<<<< HEAD
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/users", usersRouter);
app.use("/api/animals", animalsRouter);
=======
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/animals', animalsRouter);
app.use('/api/organisations', organisationsRouter);
app.use('/api/applications', applicationsRouter);
app.post('/api/login', login);
>>>>>>> 96331b38fe30c44ae8cea39f570322dac102534f

export default app;
