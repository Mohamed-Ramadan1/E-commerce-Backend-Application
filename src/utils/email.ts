import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const createMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "azaz123456az4@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transport;
};

export default createMailTransporter;
