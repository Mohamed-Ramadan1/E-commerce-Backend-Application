import app from "./app";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { initializeSocket } from "./utils/socketSetup";
import { cloudConfig } from "./config/cloudinary.config";
import { DB, PORT } from "./config/database.config";

const httpServer = createServer(app);

cloudinary.config({
  cloud_name: cloudConfig.CLOUD_NAME,
  api_key: cloudConfig.API_KEY,
  api_secret: cloudConfig.API_SECRET,
});

mongoose.connect(DB).then(() => {
  console.log("Database is connected");
});

const io = initializeSocket(httpServer);

// Socket.io setup for real-time notifications.
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
