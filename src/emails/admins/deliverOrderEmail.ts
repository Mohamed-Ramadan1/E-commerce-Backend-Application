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
 <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f0f8f0; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50; font-size: 28px; margin-bottom: 20px;">Hello ${
      user.name
    },</h2>
    <p style="margin-bottom: 20px;">We are pleased to inform you that your order with ID <strong style="color: #4CAF50; background-color: #e8f5e9; padding: 2px 5px; border-radius: 3px;">${
      order._id
    }</strong> has been successfully delivered.</p>

    <div style="background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h3 style="color: #4CAF50; margin-top: 0;">Order Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Order Status:</td>
          <td style="padding: 5px 10px;">${order.orderStatus}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Payment Method:</td>
          <td style="padding: 5px 10px;">${order.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Payment Status:</td>
          <td style="padding: 5px 10px;">${order.paymentStatus}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Shipping Address:</td>
          <td style="padding: 5px 10px;">${order.shippingAddress}</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Phone Number:</td>
          <td style="padding: 5px 10px;">${order.phoneNumber}</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #4CAF50;">Order Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #e8f5e9;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #4CAF50;">Item</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Quantity</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Price</th>
        </tr>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${
              item.product.name
            }</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">${
              item.quantity
            }</td>
            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">$${item.priceAfterDiscount.toFixed(
              2
            )}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <h3 style="color: #4CAF50;">Financial Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #e8f5e9;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #4CAF50;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Amount</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Subtotal</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">$${order.totalPrice.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Shipping Cost</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">$${order.shippingCost.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Tax Amount</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">$${order.taxAmount.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Total Discount</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">-$${order.totalDiscount.toFixed(
            2
          )}</td>
        </tr>
        <tr style="background-color: #e8f5e9; font-weight: bold;">
          <td style="padding: 10px; color: #4CAF50;">Total</td>
          <td style="padding: 10px; text-align: right; color: #4CAF50;">$${(
            order.totalPrice +
            order.shippingCost +
            order.taxAmount -
            order.totalDiscount
          ).toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <p>We hope you enjoy your purchase! If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>

    <div style="background-color: #f5f5f5; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need help?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:support@ecommerceapp.com" style="color: #4CAF50; text-decoration: none; border-bottom: 1px solid #4CAF50;">support@ecommerceapp.com</a></p>
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
      console.log("Delivery confirmation email sent");
    }
  });
};

export default confirmOrderDelivered;
