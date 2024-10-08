import { IDeleteShopRequest } from "models/shop/deleteShopRequest.interface";
import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const deleteShopRequestRejectionEmail = (
  user: IUser,
  shop: IShop,
  deleteShopRequest: IDeleteShopRequest
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Shop Deletion Request Rejection",
    text: `Dear ${user.name},\n\nWe regret to inform you that your request to delete the shop named ${shop.shopName} with application ID ${deleteShopRequest._id} has been rejected. If you have any questions or need further assistance, please contact our shop support team.\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
     <div style="font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f9f9f9; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #c82333; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Shop Deletion Request Rejection</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">We regret to inform you that your request to delete the shop named <strong style="color: #444;">${
      shop.shopName
    }</strong> with application ID <strong style="color: #444;">${
      deleteShopRequest._id
    }</strong> has been rejected.</p>
    <p style="margin-bottom: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; color: #721c24;">
      <strong>Reason for rejection:</strong> ${deleteShopRequest.reason}
    </p>
    <p style="margin-bottom: 20px;">If you have any questions about this decision or need further assistance, please <a href="mailto:azaz123456az4@gmail.com" style="color: #0056b3; text-decoration: none; border-bottom: 1px solid #0056b3;">contact our shop support team</a>.</p>
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
      console.log("Error sending shop deletion rejection email:", err.message);
    } else {
      console.log("Shop deletion rejection email sent successfully.");
    }
  });
};

export default deleteShopRequestRejectionEmail;
