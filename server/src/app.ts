
import express from 'express';
import usersRouter from './routes/users'
import animalsRouter from './routes/animals'
import cors from 'cors'
import { connectDB } from "./db";

connectDB();

const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/animals', animalsRouter);


export default app;
