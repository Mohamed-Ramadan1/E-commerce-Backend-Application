import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user.interface";
import { IReturnRequest } from "../../models/returnProducts.interface";

const returnProductRequestCancellationEmail = (
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
    <title>Return Request Cancellation Confirmation</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f4f8; padding: 20px 0; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #16a085; font-size: 28px; margin-bottom: 20px; text-align: center;">Return Request Cancellation Confirmed</h2>
    <p>Hello ${user.name || "Valued Customer"},</p>
    <p>We are writing to confirm that your return request has been successfully cancelled as per your request. Here are the details of the cancelled return:</p>
    <div style="background-color: #e8f6f3; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #1abc9c; margin-top: 0;">Cancelled Return Request Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Request ID:</td>
          <td style="padding: 5px 10px; word-break: break-all;">${
            returnRequest._id || "N/A"
          }</td>
        </tr>
       
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Original Return Status:</td>
          <td style="padding: 5px 10px;">${
            returnRequest.returnStatus || "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">New Status:</td>
          <td style="padding: 5px 10px; font-weight: bold;">Cancelled</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Cancellation Date:</td>
          <td style="padding: 5px 10px;">${new Date().toLocaleDateString()}</td>
        </tr>
      </table>
    </div>
    <div style="margin-bottom: 30px;">
      <h3 style="color: #1abc9c;">Product Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #e8f6f3;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #16a085;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #16a085;">Details</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Product Name</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">${
            returnRequest.product && returnRequest.product.name
              ? returnRequest.product.name
              : "N/A"
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Quantity</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">${
            returnRequest.quantity || "N/A"
          }</td>
        </tr>
      </table>
    </div>
    <p>Please note the following:</p>
    <ul>
      <li>Your return request has been cancelled and will not be processed further.</li>
      <li>If you still wish to return the item in the future, you will need to submit a new return request.</li>
      <li>The original order remains valid and no refund will be issued.</li>
    </ul>
    <p>If you did not request this cancellation or if you have any questions, please contact our customer support team immediately.</p>
    <div style="background-color: #f5f7fa; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need help?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:zz0a12345az@gmail.com" style="color: #16a085; text-decoration: none; border-bottom: 1px solid #16a085;">support@ecommerceapp.com</a></p>
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
        "return product request  cancellation confirmation email sent"
      );
    }
  });
};

export default returnProductRequestCancellationEmail;
