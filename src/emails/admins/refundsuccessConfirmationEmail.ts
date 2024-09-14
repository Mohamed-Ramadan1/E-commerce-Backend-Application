import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user/user.interface";
import { IRefundRequest } from "../../models/refundRequest/refund.interface";

const refundSuccessConfirmationEmail = (
  user: IUser,
  refundRequest: IRefundRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Refund Request has been Approved!",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Approval Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
        <h1 style="color: #4CAF50; text-align: center;">Great news, ${
          user.name
        }!</h1>
        
        <p style="font-size: 16px;">Your refund request for order #${
          refundRequest.order
        } has been approved.</p>
        
        <p style="font-size: 18px; font-weight: bold; text-align: center;">
            The amount of <span style="color: #4CAF50;">$${
              refundRequest.refundAmount
            }</span> has been credited to your gift card balance.
        </p>
        
        <p style="font-size: 16px;">You can use this gift card amount towards your future purchases on our platform.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Refund Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Request ID:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      refundRequest._id
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Order ID:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      refundRequest.order
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Refund Amount:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${
                      refundRequest.refundAmount
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Refund Method:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      refundRequest.refundMethod
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Refund Type:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      refundRequest.refundType
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Refund Status:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      refundRequest.refundStatus
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Processed On:</strong></td>
                    <td style="padding: 8px;">${new Date(
                      refundRequest.refundProcessedAt
                    ).toLocaleDateString()}</td>
                </tr>
            </table>
        </div>
        
        <p style="font-size: 16px; margin-top: 20px;">We hope you'll enjoy using your gift card balance!</p>
        
        <p style="font-size: 16px;">If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>

        <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>
                Best regards,<br>
                <strong>E-commerce Application Team</strong>
            </p>
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
      console.log("Refund request success email sent");
    }
  });
};

export default refundSuccessConfirmationEmail;
