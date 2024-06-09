import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port: string = process.env.PORT || "3000";



const DB: string = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log("Database is connected");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
