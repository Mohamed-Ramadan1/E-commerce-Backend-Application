import createMailTransporter from "../../../config/mailTransporter.config";
import { IShop } from "../../../models/shop/shop.interface";
import { IRefundRequest } from "../../../models/refundRequest/refund.interface";

const rejectRefundRelatedToShopAlert = (
  shop: IShop,
  refundRequest: IRefundRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email,
    subject: "Refund request related to your shop has been rejected",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Request Update</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #3498db; font-size: 28px; margin-bottom: 20px; text-align: center;">Refund Request Update</h2>
    <p>Hello ${shop.shopName},</p>
    <p>We are writing to inform you that a refund request related to your shop has been processed. The refund has been rejected, and no action is required from your end.</p>
    <div style="background-color: #ebf5fb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #2980b9; margin-top: 0;">Refund Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Order ID:</td>
          <td style="padding: 5px 10px;">${refundRequest.order}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Status:</td>
          <td style="padding: 5px 10px; color: #e74c3c; font-weight: bold;">${
            refundRequest.refundStatus
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Amount:</td>
          <td style="padding: 5px 10px;">$${refundRequest.refundAmount.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Type:</td>
          <td style="padding: 5px 10px;">${refundRequest.refundType}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Processed On:</td>
          <td style="padding: 5px 10px;">${new Date(
            refundRequest.refundProcessedAt
          ).toLocaleDateString()}</td>
        </tr>
      </table>
    </div>
    <p>This update is for your information only. The customer has been notified about the refund decision separately.</p>
    <p>If you have any questions about this update, please don't hesitate to contact our support team.</p>
    <div style="background-color: #f5f7fa; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need assistance?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:support@ecommerceapp.com" style="color: #3498db; text-decoration: none; border-bottom: 1px solid #3498db;">support@ecommerceapp.com</a></p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,</p>
    <p style="margin-top: 5px;"><strong>E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p>&copy; ${new Date().getFullYear()} Your E-commerce Company. All rights reserved.</p>
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
      console.log("Refund  request rejection email  sent to  shop .");
    }
  });
};

export default rejectRefundRelatedToShopAlert;
