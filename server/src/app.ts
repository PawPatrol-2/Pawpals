import express from 'express';
import usersRouter from './routes/users';
import animalsRouter from './routes/animals';
import organisationsRouter from './routes/Organisations';
import applicationsRouter from './routes/applications';
import cors from 'cors';
import { login } from './controllers/userController';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/animals', animalsRouter);
app.use('/api/organisations', organisationsRouter);
app.use('/api/applications', applicationsRouter);
app.post('/api/login', login);

export default app;
