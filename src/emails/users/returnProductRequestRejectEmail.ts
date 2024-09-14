import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";

import { IReturnRequest } from "../../models/returnProduct/returnProducts.interface";

const returnProductRequestRejectEmail = (
  user: IUser,
  returnRequest: IReturnRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your return product request has been created",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return Request Rejection Notification</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #d35400; font-size: 28px; margin-bottom: 20px; text-align: center;">Return Request Rejected</h2>
    <p>Dear ${user.name || "Valued Customer"},</p>
    <p>We regret to inform you that your return request has been rejected. We understand this may be disappointing, and we want to provide you with the details of this decision.</p>
    <div style="background-color: #fdf2e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #e67e22; margin-top: 0;">Return Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Request ID:</td>
          <td style="padding: 5px 10px; word-break: break-all;">${
            returnRequest._id || "N/A"
          }</td>
        </tr>
        
          <td style="padding: 5px 10px; font-weight: bold;">Return Status:</td>
          <td style="padding: 5px 10px; font-weight: bold;">Rejected</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Rejection Date:</td>
          <td style="padding: 5px 10px;">${new Date().toLocaleDateString()}</td>
        </tr>
      </table>
    </div>
    <div style="margin-bottom: 30px;">
      <h3 style="color: #e67e22;">Product Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #fdf2e9;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #d35400;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #d35400;">Details</th>
        </tr>
       
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Quantity</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">${
            returnRequest.quantity || "N/A"
          }</td>
        </tr>
      </table>
    </div>
    <div style="background-color: #fdf2e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #e67e22; margin-top: 0;">Reason for Rejection:</h3>
      <p style="margin-bottom: 0;">${
        returnRequest.rejectionReason ||
        "The return request does not meet our return policy requirements. For more details, please refer to our return policy or contact our customer support."
      }</p>
    </div>
    <p>If you believe this decision was made in error or if you need further clarification, please don't hesitate to contact our customer support team. We're here to assist you and address any concerns you may have.</p>
    <div style="background-color: #f5f7fa; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need assistance?</p>
      <p style="margin: 10px 0 0;">Contact our customer support team at <a href="mailto:zz0a123456az@gmail.com" style="color: #d35400; text-decoration: none; border-bottom: 1px solid #d35400;">support@ecommerceapp.com</a> or call us at (123) 456789.</p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">We appreciate your understanding and value your business.</p>
    <p style="margin-top: 5px;">Sincerely,</p>
    <p style="margin-top: 5px;"><strong>E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("return product request  reject  confirmation email sent");
    }
  });
};

export default returnProductRequestRejectEmail;
