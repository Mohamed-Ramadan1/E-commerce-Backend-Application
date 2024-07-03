import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user.interface";
import { IRefundRequest } from "../../models/refund.interface";

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
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #2ECC71; text-align: center;">Great news, ${user.name}!</h2>
            <p style="font-size: 16px;">Your refund request for order #${refundRequest.order} has been approved.</p>
            <p style="font-size: 16px;">The amount of $${refundRequest.refundAmount} has been credited to your gift card balance.</p>
            <p style="font-size: 16px;">You can use this gift card amount towards your future purchases on our platform.</p>
            <div style="padding: 10px; border-radius: 5px; background-color: #f7f7f7; margin-top: 10px; border: 1px solid #ddd;">
              <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Refund Summary:</p>
              <ul style="list-style-type: none; padding: 0; font-size: 16px;">
                <li style="padding: 5px 0;"><strong>Request ID:</strong> ${refundRequest._id}</li>
                <li style="padding: 5px 0;"><strong>Order ID:</strong> ${refundRequest.order}</li>
                <li style="padding: 5px 0;"><strong>Refund Amount:</strong> $${refundRequest.refundAmount}</li>
                <li style="padding: 5px 0;"><strong>Credited To:</strong> Gift Card</li>
              </ul>
            </div>
            <p style="font-size: 16px; margin-top: 20px;">We hope you'll enjoy using your gift card balance!</p>
            <p style="font-size: 16px;">If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>
            <p style="font-size: 16px; margin-top: 20px; text-align: center;">Best regards,<br><strong>E-commerce Application Team</strong></p>
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

export default refundSuccessConfirmationEmail;
