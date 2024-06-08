import express, { Application, Request, Response } from "express";
import exampleRoute from "./routes/exampleRoute";

const app: Application = express();
const port: number = 3000;

// Use the example route
app.use("/api", exampleRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
