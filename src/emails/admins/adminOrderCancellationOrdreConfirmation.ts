import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user.interface";
import { IOrder } from "../../models/order.interface";

const confirmOrderCancellation = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Cancelled",
    html: `
 <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f9f9f9; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #E74C3C; font-size: 28px; margin-bottom: 20px;">Hello ${
      user.name
    },</h2>
    <p style="margin-bottom: 20px;">We are writing to confirm that your order with ID <strong style="color: #E74C3C; background-color: #fdedeb; padding: 2px 5px; border-radius: 3px;">${
      order._id
    }</strong> has been cancelled.</p>
    <div style="background-color: #fff5f5; border-left: 4px solid #E74C3C; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; color: #E74C3C;">It seems there was an issue with the order.</p>
    </div>
    <p style="margin-bottom: 20px;">If you have already paid for the order, the amount will be refunded to your account as soon as possible.</p>
    <p style="margin-bottom: 30px;">If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>
    <div style="background-color: #f8f9fa; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; font-weight: bold;">Need help?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:zz0a12345az@gmail.com" style="color: #E74C3C; text-decoration: none; border-bottom: 1px solid #E74C3C;">support@ecommerceapp.com</a></p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,</p>
    <p style="margin-top: 5px;"><strong>E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
    </div>
  </div>
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
