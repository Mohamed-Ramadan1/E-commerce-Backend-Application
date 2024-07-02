import createMailTransporter from "./email";
import { IUser } from "../../models/user.interface";
import { IOrder } from "../../models/order.interface";

const confirmOrderCancellation = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Cancelled",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #E74C3C;">Hello ${user.name},</h2>
        <p>We are writing to confirm that your order with ID <strong>${order._id}</strong> has been  cancelled. 
        its seems to be issue with the order. if you have any questions or need further assistance, please do not hesitate to contact our customer support team.
        if you paid for the order, the amount will be refunded to your account. soon as possible.
        </p>
        <p>If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>
        <p style="margin-top: 20px;">Best regards,<br>E-commerce Application Team</p>
      </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Cancellation confirmation email sent");
    }
  });
};

export default confirmOrderCancellation;
