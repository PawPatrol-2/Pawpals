// Express app setup
import express from 'express';
import usersRouter from './routes/users'
import animalsRouter from './routes/animals'
import mongoose from 'mongoose';
import cors from 'cors'

mongoose.connect('mongodb://localhost:27017/pawpals', {
  
}).then(() => {
    console.log('Ansluten till MongoDB');
}).catch((err: unknown) => {
    console.error('MongoSB-anslutningsfel', err)
})


const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/animals', animalsRouter);


export default app;
