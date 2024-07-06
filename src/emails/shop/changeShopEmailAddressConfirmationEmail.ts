import { IShop } from "../../models/shop.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

const verificationLink =
  "http://localhost:3000/api/v1/shops/my-shop/update-email";
const changeShopEmailAddressConfirmationEmail = (
  user: IUser,
  shop: IShop,
  verificationToken: string,
  newEmail: string
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Change Shop Email Address Request",
    text: `Dear ${user.name},\n\nThank you for submitting your request to change your shop email address to ${newEmail}. Your request has been received. Please click on the following link to confirm the email address change: ${verificationLink}/${verificationToken}\n\nThis verification email is valid for only 30 minutes.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #007BFF; border-radius: 5px;">
        <h2 style="text-align: center; color: #007BFF;">Change Shop Email Request Received</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for submitting your request to change your shop email address to ${newEmail}. Your request has been received.</p>
        <p>Please click on the following link to confirm the email address change: <a href="${verificationLink}/${verificationToken}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 3px;">Change Email Address</a></p>
        <p>This verification email is valid for only 30 minutes.</p>
        <p>If you have any questions, feel free to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
        <p>Best regards,</p>
        <p><strong>Your E-commerce Application Team</strong></p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #888;">This email was sent to ${
          user.email
        } because you requested to change your shop email address on our platform.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
      </div>
    </div>
    `,
  };
  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(
        "Error sending shop request confirmation email:",
        err.message
      );
    } else {
      console.log("Shop request confirmation email sent successfully.");
    }
  });
};

export default changeShopEmailAddressConfirmationEmail;
