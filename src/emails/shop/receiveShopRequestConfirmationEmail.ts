import { IShopRequest } from "../../models/newShopRequest/shopRequest.interface";
import { IUser } from "../../models/user/user.interface";

import createMailTransporter from "../../config/mailTransporter.config";

const receiveShopRequestConfirmationEmail = (
  user: IUser,
  shopRequest: IShopRequest
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Shop Request Received",
    text: `Dear ${user.name},\n\nThank you for your interest in opening a shop on our e-commerce platform. We have received your request. Your application ID is ${shopRequest._id}. Our team will review your request and get back to you shortly.\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f7f7f7; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #0056b3; margin-bottom: 30px; font-size: 28px; font-weight: 600;">Shop Request Received</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">Thank you for your interest in opening a shop on our e-commerce platform. We have received your request.</p>
    <p style="margin-bottom: 20px;">Your application ID is: <strong style="color: #0056b3; font-size: 18px; display: inline-block; padding: 5px 10px; background-color: #e6f2ff; border-radius: 4px;">${
      shopRequest._id
    }</strong></p>
    <p style="margin-bottom: 20px;">Our team will review your request and get back to you shortly.</p>
    <p style="margin-bottom: 20px;">If you have any questions in the meantime, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #0056b3; text-decoration: none; border-bottom: 1px solid #0056b3;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to open a shop on our platform.</p>
      <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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

export default receiveShopRequestConfirmationEmail;
