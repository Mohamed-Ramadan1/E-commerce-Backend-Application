import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

import productRoutes from "./routes/productsRoutes";

import globalError from "./controllers/errorController";
import AppError from "./utils/ApplicationError";

const app: Application = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

//serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError);
export default app;
