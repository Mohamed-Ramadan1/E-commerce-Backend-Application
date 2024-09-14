import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";

import createMailTransporter from "../../config/mailTransporter.config";

const resetShopEmailAddressToDefaultEmail = (user: IUser, shop: IShop) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Reset Your Shop Email Address",
    text: `Dear ${user.name},\n\nYour shop email address has been reset to the default email address (${user.email}).\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f0f7ff; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 2px solid #007BFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #007BFF; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Reset Your Shop Email Address</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <div style="background-color: #e6f3ff; border: 1px solid #b8daff; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0; color: #004085;">Your shop email address has been reset to the default email address:</p>
      <p style="margin: 10px 0 0; font-weight: bold; font-size: 18px; color: #007BFF;">${
        user.email
      }</p>
    </div>
    <p style="margin-bottom: 20px;">If you did not request this change or have any questions, please <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF; text-decoration: none; border-bottom: 1px solid #007BFF;">contact us</a> immediately.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to reset your shop email address on our platform.</p>
      <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</div>
        `,
  };
  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log("Error sending welcome email to new address:", err.message);
    } else {
      console.log("Welcome email sent to new address successfully.");
    }
  });
};

export default resetShopEmailAddressToDefaultEmail;
