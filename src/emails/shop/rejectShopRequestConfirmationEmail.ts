import { IShopRequest } from "../../models/shop/shopRequest.interface";
import { IUser } from "../../models/user/user.interface";

import createMailTransporter from "../../config/mailTransporter.config";

const rejectShopRequestConfirmationEmail = (
  user: IUser,
  shopRequest: IShopRequest,
  rejectionReason: string
) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>", // sender address
    to: user.email, // list of receivers
    subject: "Shop Request Rejection Notice", // Subject line
    text: `Dear ${user.name},\n\nWe regret to inform you that your request to open a shop with application ID ${shopRequest._id} has been rejected. The reason for the rejection is as follows:\n\n${rejectionReason}\n\nIf you have any further questions or need assistance, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
   <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f9f9f9; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #dc3545; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Shop Request Rejected</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">We regret to inform you that your request to open a shop with application ID <strong style="color: #444; background-color: #f1f1f1; padding: 2px 5px; border-radius: 3px;">${
      shopRequest._id
    }</strong> has been rejected.</p>
    <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0; color: #721c24;"><strong>Reason for rejection:</strong></p>
      <p style="margin: 10px 0 0; font-style: italic;">${rejectionReason}</p>
    </div>
    <p style="margin-bottom: 20px;">If you have any further questions or need assistance, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #0056b3; text-decoration: none; border-bottom: 1px solid #0056b3;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to open a shop on our platform and the request has been rejected.</p>
      <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</div>
    `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Shop request rejection email sent successfully.");
    }
  });
};

export default rejectShopRequestConfirmationEmail;
