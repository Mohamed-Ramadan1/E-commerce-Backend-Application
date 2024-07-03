import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user.interface";
import { IOrder } from "../../models/order.interface";

const confirmOrderDelivered = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Delivered",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #4CAF50;">Hello ${user.name},</h2>
      <p>We are pleased to inform you that your order with ID <strong>${order._id}</strong> has been successfully delivered.</p>
      <p>We hope you enjoy your purchase! If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>
      <p style="margin-top: 20px;">Best regards,<br>E-commerce Application Team</p>
    </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Delivery confirmation email sent");
    }
  });
};

export default confirmOrderDelivered;
