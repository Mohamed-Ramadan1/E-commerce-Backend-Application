import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

const port: string = process.env.PORT || "3000";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const DB: string = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("Database is connected");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
