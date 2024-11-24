import express from 'express';
import authRouter from './Router/userRoute.js';
import tanamanRouter from './Router/tanamanRoute.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/tanaman', tanamanRouter);

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});