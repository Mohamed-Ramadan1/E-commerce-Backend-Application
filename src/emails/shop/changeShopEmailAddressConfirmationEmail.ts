import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";
import createMailTransporter from "../mailTransporter";

const verificationLink =
  "http://localhost:3000/api/v1/shops/my-shop/verify-changed-email";
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
   <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f0f7ff; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 2px solid #007BFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #007BFF; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Change Shop Email Request Received</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">Thank you for submitting your request to change your shop email address to <strong style="color: #007BFF;">${newEmail}</strong>. Your request has been received.</p>
    <p style="margin-bottom: 20px;">Please click on the following button to confirm the email address change:</p>
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${verificationLink}/${verificationToken}" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease;">Change Email Address</a>
    </div>
    <p style="margin-bottom: 20px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; padding: 15px; color: #856404;">
      <strong>Important:</strong> This verification email is valid for only 30 minutes.
    </p>
    <p style="margin-bottom: 20px;">If you have any questions, feel free to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF; text-decoration: none; border-bottom: 1px solid #007BFF;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to change your shop email address on our platform.</p>
      <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
    </div>
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
