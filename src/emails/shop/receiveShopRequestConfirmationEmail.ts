import { IShopRequest } from "../../models/shopRequest.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 1rem;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #007BFF;">Shop Request Received</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for your interest in opening a shop on our e-commerce platform. We have received your request. Your application ID is <strong>${
          shopRequest._id
        }</strong>. Our team will review your request and get back to you shortly.</p>
        <p>If you have any questions in the meantime, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
        <p>Best regards,</p>
        <p><strong>Your E-commerce Application Team</strong></p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #888;">This email was sent to ${
          user.email
        } because you requested to open a shop on our platform.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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
