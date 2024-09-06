import dotenv from "dotenv";
dotenv.config();

export const cloudConfig = {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.CLOUD_API_KEY,
  API_SECRET: process.env.CLOUD_API_SECRET,
};
