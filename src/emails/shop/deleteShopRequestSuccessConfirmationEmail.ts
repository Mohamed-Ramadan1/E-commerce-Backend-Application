import { IDeleteShopRequest } from "../../models/deleteShopRequest/deleteShopRequest.interface";
import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";
import createMailTransporter from "../mailTransporter";

const deleteShopRequestSuccessConfirmationEmail = (
  user: IUser,
  shop: IShop,
  deleteShopRequest: IDeleteShopRequest
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Shop Deletion Request Confirmation",
    text: `Dear ${user.name},\n\nWe are writing to confirm that your request to delete the shop named ${shop.shopName} with application ID ${deleteShopRequest._id} has been successfully processed. If this was a mistake or if you have any further questions, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f6f6f6; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #c82333; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Shop Deletion Request Confirmation</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">We are writing to confirm that your request to delete the shop named <strong style="color: #444;">${
      shop.shopName
    }</strong> with application ID <strong style="color: #444;">${
      deleteShopRequest._id
    }</strong> has been successfully processed.</p>
    <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; color: #721c24;"><strong>Important:</strong> This action is irreversible. If you believe this was a mistake, please contact us immediately.</p>
    </div>
    <p style="margin-bottom: 20px;">If you have any further questions or concerns, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #0056b3; text-decoration: none; border-bottom: 1px solid #0056b3;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
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
        "Error sending shop deletion confirmation email:",
        err.message
      );
    } else {
      console.log("Shop deletion confirmation email sent successfully.");
    }
  });
};

export default deleteShopRequestSuccessConfirmationEmail;
