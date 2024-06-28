import createMailTransporter from "./email";
import { IUser } from "../../models/user.interface.js";

const sendResetPasswordEmail = (user: IUser, resetToken: string) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4CAF50;">Hello ${user.name},</h2>
        <p>We received a request to reset your password for your account. Click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="http://127.0.0.1:3000/api/v1/auth/reset-password/${resetToken}" 
             style="display: inline-block; padding: 15px 30px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 60 minutes.</p>
        <p style="margin-top: 20px;">Best regards,<br>E-commerce Application Team</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser: <a href="http://127.0.0.1:3000/api/v1/auth/reset-password/${resetToken}" style="color: #4CAF50;">http://127.0.0.1:3000/api/v1/auth/reset-password/${resetToken}</a></p>
      </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Reset password email sent");
    }
  });
};

export default sendResetPasswordEmail;
