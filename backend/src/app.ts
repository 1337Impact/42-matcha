import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './auth/authRoutes';
import userRouter from './user/userRoutes';
import authorize from './middleware';

const app = express();


app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/user', authorize, userRouter);

export default app;
