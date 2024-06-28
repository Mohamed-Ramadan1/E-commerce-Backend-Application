import createMailTransporter from "./email";
import { IUser } from "../models/user.interface.js";

const sendVerificationMail = (user: IUser) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Hello ${user.name},</h2>
        <p>Thank you for registering with our E-commerce application. Please verify your email by clicking the link below:</p>
        <p>
          <a href="http://127.0.0.1:3000/api/v1/auth/verify-email/${user.emailVerificationToken}" 
             style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            Verify your email
          </a>
        </p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p style="margin-top: 20px;">Best regards,<br>E-commerce Application Team</p>
      </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("verification email sent");
    }
  });
};

export default sendVerificationMail;
