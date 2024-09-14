import { IUser } from "../../models/user/user.interface";
import { IShopRequest } from "../../models/newShopRequest/shopRequest.interface";
import createMailTransporter from "../mailTransporter";

const cancelShopRequestConfirmationEmail = (
  user: IUser,
  shopRequest: IShopRequest
) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>", // sender address
    to: user.email, // list of receivers
    subject: "Shop Request Cancellation Confirmation", // Subject line
    text: `Dear ${user.name},\n\nWe are writing to confirm that your request to open a shop with application ID ${shopRequest._id} has been successfully cancelled. If this was a mistake or if you have any further questions, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f8f8f8; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #c82333; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Shop Request Cancellation</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">We are writing to confirm that your request to open a shop with application ID <strong style="color: #444; background-color: #f1f1f1; padding: 2px 5px; border-radius: 3px;">${
      shopRequest._id
    }</strong> has been successfully cancelled.</p>
    <p style="margin-bottom: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; color: #721c24;">
      <strong>Note:</strong> If this cancellation was made in error, you may need to submit a new shop request.
    </p>
    <p style="margin-bottom: 20px;">If you have any further questions or concerns, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #0056b3; text-decoration: none; border-bottom: 1px solid #0056b3;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to open a shop on our platform and subsequently cancelled the request.</p>
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
      console.log("Shop request cancellation email sent successfully.");
    }
  });
};

export default cancelShopRequestConfirmationEmail;
