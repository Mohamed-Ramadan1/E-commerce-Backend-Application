import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";

import { IRefundRequest } from "../../models/refundRequest/refund.interface";
import { IReturnRequest } from "../../models/returnProduct/returnProducts.interface";
const refundRequestForReturnedItemsEmail = (
  user: IUser,
  refundRequest: IRefundRequest,
  returnedItem: IReturnRequest
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Refund Request has been Created",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return and Refund Request Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">Return and Refund Request Confirmation</h2>
        </div>
        <div style="padding: 30px;">
            <p>Dear ${user.name},</p>
            <p>We have received your return and refund request. Below are the details of your request:</p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px; padding: 15px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #2c3e50;">Refund Request Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Request ID:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          refundRequest._id
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Order ID:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          refundRequest.order
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Refund Amount:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">$${refundRequest.refundAmount.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Refund Method:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          refundRequest.refundMethod
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Refund Type:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          refundRequest.refundType
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Refund Status:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          refundRequest.refundStatus
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Request Date:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${refundRequest.createdAt.toDateString()}</td>
                    </tr>
                    ${
                      refundRequest.refundProcessedAt
                        ? `
                    <tr>
                        <td style="padding: 8px;"><strong>Processed Date:</strong></td>
                        <td style="padding: 8px;">${refundRequest.refundProcessedAt.toDateString()}</td>
                    </tr>
                    `
                        : ""
                    }
                </table>
            </div>
            
            <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px; padding: 15px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #2c3e50;">Returned Item Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Return Request ID:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          returnedItem._id
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Product:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          returnedItem.product.name
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Quantity:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          returnedItem.quantity
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Return Reason:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          returnedItem.returnReason
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Return Status:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${
                          returnedItem.returnStatus
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;"><strong>Received Items Status:</strong></td>
                        <td style="padding: 8px;">${
                          returnedItem.receivedItemsStatus
                        }</td>
                    </tr>
                </table>
            </div>
            
            <p style="margin-top: 20px;"><strong>Next Steps:</strong></p>
            <ol style="margin-left: 20px; padding-left: 0;">
                <li>Please package the item(s) securely in their original packaging, if possible.</li>
                <li>Include a copy of this return request or the order number in the package.</li>
                <li>Once we receive and inspect your return, we'll process the refund to your original payment method.</li>
            </ol>
            
            <p>Please note that the refund process may take 5-10 business days, depending on your bank or credit card issuer.</p>
            
            <p>If you have any questions or need further assistance, please don't hesitate to contact our customer support team:</p>
            <p style="margin-left: 20px;">
                Email: <a href="mailto:zz0a12345az@gmail.com" style="color: #2c3e50;">zz0a12345az@gmail.com</a><br>
                Phone: +20 12345678910
            </p>
        </div>
        <div style="background-color: #34495e; color: #ffffff; padding: 20px; text-align: center; font-size: 14px;">
            <p>Thank you for your patience and understanding.<br><strong>E-commerce Application Customer Service Team</strong></p>
            <p style="margin-top: 10px; font-size: 12px;">&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
            <p style="font-size: 12px;">Email sent on: ${new Date().toLocaleString()}</p>
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

export default refundRequestForReturnedItemsEmail;
