import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
const app: Application = express();

dotenv.config();
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
