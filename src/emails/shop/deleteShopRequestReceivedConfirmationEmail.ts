import { IDeleteShopRequest } from "../../models/deleteShopRequest.interface";
import { IShop } from "../../models/shop.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size:1rem;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="text-align: center; color: #dc3545;">Shop Deletion Request Received</h2>
          <p>Dear ${user.name},</p>
          <p>We have received your request to delete the shop named <strong>${
            shop.shopName
          }</strong> with application ID <strong>${
      deleteShopRequest._id
    }</strong>. Our team will process this request shortly. If you have any further questions, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${
            user.email
          } because you requested to delete a shop on our platform.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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
