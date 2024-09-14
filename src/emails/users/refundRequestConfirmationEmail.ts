import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { IRefundRequest } from "../../models/refundRequest/refund.interface";

const refundRequestCreatedEmail = (
  user: IUser,
  refundRequest: IRefundRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Refund Request has been Created",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #3498db; font-size: 28px; margin-bottom: 20px; text-align: center;">Refund Request Confirmation</h2>
    <p>Hello ${user.name},</p>
    <p>We are writing to confirm that your refund request has been successfully created. Here are the details of your request:</p>

    <div style="background-color: #e8f4fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #2980b9; margin-top: 0;">Refund Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Request ID:</td>
          <td style="padding: 5px 10px;">${refundRequest._id}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Order ID:</td>
          <td style="padding: 5px 10px;">${refundRequest.order}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Status:</td>
          <td style="padding: 5px 10px;">${refundRequest.refundStatus}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Type:</td>
          <td style="padding: 5px 10px;">${refundRequest.refundType}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Method:</td>
          <td style="padding: 5px 10px;">${refundRequest.refundMethod}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #2980b9;">Financial Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #e8f4fd;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #3498db;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #3498db;">Amount</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Refund Amount</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0; font-weight: bold;">$${refundRequest.refundAmount.toFixed(
            2
          )}</td>
        </tr>
      </table>
    </div>

    <p>We will process your request shortly and keep you updated on its status. Please allow 5-10 business days for the refund to be processed and reflected in your account.</p>

    <p>If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>

    <div style="background-color: #f5f7fa; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need help?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:support@ecommerceapp.com" style="color: #3498db; text-decoration: none; border-bottom: 1px solid #3498db;">support@ecommerceapp.com</a></p>
    </div>

    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,</p>
    <p style="margin-top: 5px;"><strong>E-commerce Application Team</strong></p>

    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Refund request creation email sent");
    }
  });
};

export default refundRequestCreatedEmail;
