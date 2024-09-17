import { IDeleteShopRequest } from "models/shop/deleteShopRequest.interface";
import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const deleteShopRequestReceivedConfirmationEmail = (
  user: IUser,
  shop: IShop,
  deleteShopRequest: IDeleteShopRequest
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Shop Deletion Request Received",
    text: `Dear ${user.name},\n\nWe have received your request to delete the shop named ${shop.shopName} with application ID ${deleteShopRequest._id}. Our team will process this request shortly. If you have any further questions, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f4f4f4; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #e74c3c; margin-bottom: 30px; font-size: 28px;">Shop Deletion Request Received</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">We have received your request to delete the shop named <strong style="color: #2c3e50;">${
      shop.shopName
    }</strong> with application ID <strong style="color: #2c3e50;">${
      deleteShopRequest._id
    }</strong>.</p>
    <p style="margin-bottom: 20px;">Our team will process this request shortly. If you have any further questions, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #3498db; text-decoration: none; border-bottom: 1px solid #3498db;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #7f8c8d;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to delete a shop on our platform.</p>
      <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</div>
    `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(
        "Error sending shop deletion request received email:",
        err.message
      );
    } else {
      console.log("Shop deletion request received email sent successfully.");
    }
  });
};

export default deleteShopRequestReceivedConfirmationEmail;
