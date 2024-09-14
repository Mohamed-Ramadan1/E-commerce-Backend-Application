import createMailTransporter from "../../../config/mailTransporter.config";
import { IShop } from "../../../models/shop/shop.interface";
import { IReturnRequest } from "../../../models/returnProduct/returnProducts.interface";

const rejectReturnProductShopAlert = (
  shop: IShop,
  returnRequest: IReturnRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email,
    subject: "Return  product related to your shop has been rejected",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return Request Rejected</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #3498db; font-size: 28px; margin-bottom: 20px; text-align: center;">Return Request Rejected</h2>
    <p>Hello ${shop.shopName},</p>
    <p>We are writing to inform you that a return request for a product from your shop has been rejected. Below are the details of the rejected request:</p>
    <div style="background-color: #ebf5fb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #2980b9; margin-top: 0;">Return Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Request ID:</td>
          <td style="padding: 5px 10px;">${returnRequest._id}</td>
        </tr>
      
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Return Status:</td>
          <td style="padding: 5px 10px; color: #3498db; font-weight: bold;">${
            returnRequest.returnStatus
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Return Reason:</td>
          <td style="padding: 5px 10px;">${returnRequest.returnReason}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Rejection Reason:</td>
          <td style="padding: 5px 10px;">${returnRequest.rejectionReason}</td>
        </tr>
      </table>
    </div>
    <div style="margin-bottom: 30px;">
      <h3 style="color: #2980b9;">Product Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #ebf5fb;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #3498db;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #3498db;">Details</th>
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
    <p>The return request has been rejected for the reason stated above. No further action is required from your end regarding this return request.</p>
    <p>If you have any questions or concerns about this decision, please don't hesitate to contact our support team.</p>
    <div style="background-color: #f5f7fa; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need assistance?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:azaz123456az4@gmail.com" style="color: #3498db; text-decoration: none; border-bottom: 1px solid #3498db;">support@ecommerceapp.com</a></p>
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
      console.log("Return request rejection email  sent to product shop.");
    }
  });
};

export default rejectReturnProductShopAlert;
