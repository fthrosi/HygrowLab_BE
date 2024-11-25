import express from 'express';
import authRouter from './Router/userRoute.js';
import tanamanRouter from './Router/tanamanRoute.js';
import pencatatanRouter from './Router/recordRoute.js';
import kalkulasiRouter from './Router/kalkulasiRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRouter);
app.use('/tanaman', tanamanRouter);
app.use('/recordings', pencatatanRouter);
app.use('/kalkulasi', kalkulasiRouter);

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});