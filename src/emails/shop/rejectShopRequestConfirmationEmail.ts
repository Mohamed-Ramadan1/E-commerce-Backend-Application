import { IShopRequest } from "../../models/shopRequest.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size:1rem;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="text-align: center; color: #dc3545;">Shop Request Rejected</h2>
          <p>Dear ${user.name},</p>
          <p>We regret to inform you that your request to open a shop with application ID <strong>${
            shopRequest._id
          }</strong> has been rejected. The reason for the rejection is as follows:</p>
          <p><em>${rejectionReason}</em></p>
          <p>If you have any further questions or need assistance, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${
            user.email
          } because you requested to open a shop on our platform and the request has been rejected.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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
