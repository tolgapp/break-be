import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/routing';
import { requestLogger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const allowedOrigins = process.env.FRONTEND_LINK ? process.env.FRONTEND_LINK.split(',') : [];
const url = process.env.MONGO_URI;

mongoose
  .connect(url as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('MongoDB connection error', error));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'userid'],
    optionsSuccessStatus: 204,
  })
);

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`🔥 Server is running on Port ${PORT}`);
});