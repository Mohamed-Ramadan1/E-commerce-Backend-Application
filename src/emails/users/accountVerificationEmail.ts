import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user/user.interface";

const sendVerificationMail = (user: IUser) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Please Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <main>
          <h2 style="color: #333; font-size: 24px; text-align: center;">Welcome to Our E-commerce Application, ${user.name}!</h2>
          <p style="font-size: 16px; text-align: center; color: #666;">Thank you for registering with us. Please confirm your email address by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="http://127.0.0.1:3000/api/v1/auth/verify-email/${user.emailVerificationToken}" 
              style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin-top: 20px;">
              Verify Your Email
            </a>
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">If you did not create an account, please disregard this email.</p>
        </main>
        <footer style="text-align: center; margin-top: 30px;">
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-bottom: 10px;">
          <p style="font-size: 14px; color: #999;">Visit our website: 
            <a href="http://your-ecommerce-website.com" style="color: #4CAF50; text-decoration: none;">E-commerce Application</a>
          </p>
        </footer>
      </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Verification email sent");
    }
  });
};

export default sendVerificationMail;
