import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user.interface";
import { IRefundRequest } from "../../models/refund.interface";
import { IReturnRequest } from "../../models/returnProducts.interface";

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
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
          <h2 style="color: #E74C3C; text-align: center;">Hello ${user.name},</h2>
          <p style="font-size: 16px;">We are writing to inform you that your refund request has been successfully created.</p>
          <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; margin-top: 10px;">
            <p style="font-size: 16px;"><strong>Refund Request Details:</strong></p>
            <ul style="list-style-type: none; padding: 0;">
              <li style="padding: 5px 0;"><strong>Request ID:</strong> ${refundRequest._id}</li>
              <li style="padding: 5px 0;"><strong>Order ID:</strong> ${refundRequest.order}</li>
              <li style="padding: 5px 0;"><strong>Refund Amount:</strong> $${refundRequest.refundAmount}</li>
              <li style="padding: 5px 0;"><strong>Refund Method:</strong> ${refundRequest.refundMethod}</li>
              <li style="padding: 5px 0;"><strong>Refund Type:</strong> ${refundRequest.refundType}</li>
              <li style="padding: 5px 0;"><strong>Refund Status:</strong> ${refundRequest.refundStatus}</li>
            </ul>
          </div>
          <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; margin-top: 10px;">
            <p style="font-size: 16px;"><strong>Return Request Details:</strong></p>
            <ul style="list-style-type: none; padding: 0;">
              <li style="padding: 5px 0;"><strong>Return Request ID:</strong> ${returnedItem._id}</li>
              <li style="padding: 5px 0;"><strong>Product:</strong> ${returnedItem.product.name}</li>
              <li style="padding: 5px 0;"><strong>Quantity:</strong> ${returnedItem.quantity}</li>
              <li style="padding: 5px 0;"><strong>Return Reason:</strong> ${returnedItem.returnReason}</li>
              <li style="padding: 5px 0;"><strong>Return Status:</strong> ${returnedItem.returnStatus}</li>
              <li style="padding: 5px 0;"><strong>Received Items Status:</strong> ${returnedItem.receivedItemsStatus}</li>
            </ul>
          </div>
          <p style="font-size: 16px;">We will process your request shortly and keep you updated on the status.</p>
          <p style="font-size: 16px;">If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>
          <p style="margin-top: 20px; font-size: 16px;">Best regards,<br><strong>E-commerce Application Team</strong></p>
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

export default refundRequestForReturnedItemsEmail;
