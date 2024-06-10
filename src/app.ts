import express, { Application, NextFunction, Request, Response } from "express";

import globalError from "./controllers/errorController";
import AppError from "./utils/ApplicationError";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";

const app: Application = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use("/api/v1/users", userRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError);
export default app;
