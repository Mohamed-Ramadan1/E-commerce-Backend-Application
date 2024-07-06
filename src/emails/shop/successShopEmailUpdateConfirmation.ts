import { IShop } from "../../models/shop.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

const successShopEmailUpdateConfirmation = (user: IUser, shop: IShop) => {
  const transporter = createMailTransporter();
  const newEmail = shop.email;

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Shop Email Address Has Been Updated Successfully!",
    text: `Dear ${user.name},\n\nYour shop email address for ${shop.shopName} has been successfully updated to ${newEmail}. You can now manage all your shop operations using this new email address.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #007BFF; border-radius: 5px;">
          <h2 style="text-align: center; color: #007BFF;">Shop Email Address Updated Successfully!</h2>
          <p>Dear ${user.name},</p>
          <p>We're happy to inform you that your shop email address for "${
            shop.shopName
          }" has been successfully updated to ${newEmail}.</p>
          <p>You can now manage all your shop operations, including receiving order notifications, managing customer inquiries, and updating product listings, using this new email address.</p>
          <p>If you have any questions, feel free to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${newEmail} because you requested to change your shop email address on our platform.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
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

export default successShopEmailUpdateConfirmation;
