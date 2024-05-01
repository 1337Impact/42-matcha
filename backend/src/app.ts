import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './auth/authRoutes';

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRouter);

export default app;
