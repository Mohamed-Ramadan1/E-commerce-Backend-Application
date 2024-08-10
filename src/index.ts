import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { initializeSocket } from "./utils/socketSetup";
dotenv.config();

// const port: string = process.env.PORT || "3000";
const port: number = parseInt(process.env.PORT || "3000", 10);
const httpServer = createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const DB: string = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("Database is connected");
});

const io = initializeSocket(httpServer);

// Socket.io setup for real-time notifications.
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
