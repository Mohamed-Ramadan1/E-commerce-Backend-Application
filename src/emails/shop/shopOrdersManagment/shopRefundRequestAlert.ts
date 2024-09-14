import createMailTransporter from "../../mailTransporter";
import { IShop } from "../../../models/shop/shop.interface";
import { IRefundRequest } from "../../../models/refundRequest/refund.interface";

const shopRefundRequestAlert = (shop: IShop, refundRequest: IRefundRequest) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email,
    subject: "Refund request related to your shop have been created",
    html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Request Notification for Shop Owner</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #2c3e50; font-size: 28px; margin-bottom: 20px; text-align: center;">New Refund Request Notification</h2>
    <p>Dear ${shop.shopName || "Shop Owner"},</p>
    <p>A new refund request has been created for an order from your shop. Please review the details below:</p>
    <div style="background-color: #ecf0f1; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #34495e; margin-top: 0;">Refund Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Request ID:</td>
          <td style="padding: 5px 10px; word-break: break-all;">${
            refundRequest._id || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Order ID:</td>
          <td style="padding: 5px 10px; word-break: break-all;">${
            refundRequest.order || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Status:</td>
          <td style="padding: 5px 10px;">${
            refundRequest.refundStatus || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Type:</td>
          <td style="padding: 5px 10px;">${
            refundRequest.refundType || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Method:</td>
          <td style="padding: 5px 10px;">${
            refundRequest.refundMethod || "N/A"
          }</td>
        </tr>
      </table>
    </div>
    <div style="margin-bottom: 30px;">
      <h3 style="color: #34495e;">Financial Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #ecf0f1;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2c3e50;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #2c3e50;">Amount</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Refund Amount</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0; font-weight: bold;">$${
            refundRequest.refundAmount
              ? refundRequest.refundAmount.toFixed(2)
              : "0.00"
          }</td>
        </tr>
      </table>
    </div>
    <p>Please take the following actions:</p>
    <ol>
      <li>Review the refund request details in your shop management dashboard.</li>
      <li>Ensure that the returned item(s) have been received (if applicable).</li>
      <li>Process the refund according to your shop's policies and the platform guidelines.</li>
      <li>Update the refund status in the system once processed.</li>
    </ol>
    <p>If you have any questions or concerns about this refund request, please contact our merchant support team.</p>
    <div style="background-color: #ecf0f1; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need assistance?</p>
      <p style="margin: 10px 0 0;">Contact our merchant support team at <a href="mailto:merchantsupport@ecommerceapp.com" style="color: #2c3e50; text-decoration: none; border-bottom: 1px solid #2c3e50;">merchantsupport@ecommerceapp.com</a></p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">Thank you for your prompt attention to this matter.</p>
    <p style="margin-top: 5px;">Best regards,</p>
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
      console.log("Refund request creation email sent");
    }
  });
};

export default shopRefundRequestAlert;
