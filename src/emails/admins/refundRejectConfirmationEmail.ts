import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user.interface";
import { IRefundRequest } from "../../models/refund.interface";

const refundRejectConfirmationEmail = (
  user: IUser,
  refundRequest: IRefundRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Refund Request has been Rejected!",
    html: `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Request Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
        <h1 style="color: #e74c3c; text-align: center;">Refund Request Update</h1>
        
        <p style="font-size: 16px;">Dear ${user.name},</p>
        
        <p style="font-size: 16px;">We regret to inform you that your refund request for order #${
          refundRequest.order
        } has been rejected.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Refund Request Details</h2>
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
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Requested Amount:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${
                      refundRequest.refundAmount
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Refund Type:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                      refundRequest.refundType
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Request Status:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #e74c3c;"><strong>${
                      refundRequest.refundStatus
                    }</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Processed On:</strong></td>
                    <td style="padding: 8px;">${new Date(
                      refundRequest.refundProcessedAt
                    ).toLocaleDateString()}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: #fdf2f2; border: 1px solid #e74c3c; border-radius: 5px; padding: 15px; margin-top: 20px;">
            <h3 style="color: #e74c3c; margin-top: 0;">Reason for Rejection</h3>
            <p style="margin-bottom: 0;">${refundRequest.rejectReason}</p>
        </div>
        
        <p style="font-size: 16px; margin-top: 20px;">If you believe this decision was made in error or if you need further clarification, please don't hesitate to contact our customer support team. We're here to assist you and address any concerns you may have.</p>
        
        <p style="font-size: 16px;">Thank you for your understanding and continued patronage.</p>

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
      console.log(`Refund request reject email sent to${user.email}`);
    }
  });
};

export default refundRejectConfirmationEmail;
