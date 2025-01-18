import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/routing";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const allowedOrigins = process.env.FRONTEND_LINK;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "userid"],
    optionsSuccessStatus: 204,
  })
);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error", error));


app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Happy Coding! 🔥 Server is running on Port ${PORT}`);
});
