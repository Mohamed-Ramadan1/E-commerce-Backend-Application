import { IShopRequest } from "../../models/shopRequest.interface";
import { IUser } from "../../models/user.interface";
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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size:1rem;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="text-align: center; color: #dc3545;">Shop Request Cancellation</h2>
          <p>Dear ${user.name},</p>
          <p>We are writing to confirm that your request to open a shop with application ID <strong>${
            shopRequest._id
          }</strong> has been successfully cancelled. If this was a mistake or if you have any further questions, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${
            user.email
          } because you requested to open a shop on our platform and subsequently cancelled the request.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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
