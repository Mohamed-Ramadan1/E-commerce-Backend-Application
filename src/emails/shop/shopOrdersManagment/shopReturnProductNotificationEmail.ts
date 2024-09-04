import createMailTransporter from "../../mailTransporter";
import { IReturnRequest } from "../../../models/returnProducts.interface";
import { IShop } from "../../../models/shop.interface";

const shopReturnProductNotificationEmail = (
  shop: IShop,
  returnRequest: IReturnRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email,
    subject: "Your return product request has been created",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return Request Notification</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #e67e22; font-size: 28px; margin-bottom: 20px; text-align: center;">Return Request Notification</h2>
    <p>Hello ${shop.shopName},</p>
    <p>We would like to inform you that a return request has been made for a product from your shop. Below are the details of the request:</p>
    <div style="background-color: #fdf3e8; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #d35400; margin-top: 0;">Return Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Request ID:</td>
          <td style="padding: 5px 10px;">${returnRequest._id}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Order ID:</td>
          <td style="padding: 5px 10px;">${returnRequest.order}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Return Status:</td>
          <td style="padding: 5px 10px;">${returnRequest.returnStatus}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Received Items Status:</td>
          <td style="padding: 5px 10px;">${
            returnRequest.receivedItemsStatus
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Return Reason:</td>
          <td style="padding: 5px 10px;">${returnRequest.returnReason}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Refund Amount:</td>
          <td style="padding: 5px 10px;">$${returnRequest.refundAmount.toFixed(
            2
          )}</td>
        </tr>
      </table>
    </div>
    <div style="margin-bottom: 30px;">
      <h3 style="color: #d35400;">Product Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #fdf3e8;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e67e22;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e67e22;">Details</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Product Name</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">${
            returnRequest.product.name
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Quantity</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">${
            returnRequest.quantity
          }</td>
        </tr>
      </table>
    </div>
    <p>Please review the return request and take the necessary actions. You can view and manage this request from your shop dashboard.</p>
    <ul>
      <li>The return request is currently in <strong>${
        returnRequest.returnStatus
      }</strong> status.</li>
      <li>The received items status is set to <strong>${
        returnRequest.receivedItemsStatus
      }</strong>.</li>
      <li>If the return is approved, please ensure the appropriate refund process is initiated.</li>
    </ul>
    <p>If you have any questions or need assistance, please contact our support team.</p>
    <div style="background-color: #f5f7fa; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need help?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:support@ecommerceapp.com" style="color: #e67e22; text-decoration: none; border-bottom: 1px solid #e67e22;">support@ecommerceapp.com</a></p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,</p>
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
      console.log(
        "return product request confirmation email sent to shop successfully"
      );
    }
  });
};

export default shopReturnProductNotificationEmail;
