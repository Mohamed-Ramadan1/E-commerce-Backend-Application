import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";

const confirmOrderCancelled = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Cancelled",
    html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; font-size: 16px; background-color: #f8f0f0; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #E74C3C; font-size: 28px; margin-bottom: 20px;">Hello ${
      user.name
    },</h2>
    <p style="margin-bottom: 20px;">We are writing to confirm that your order with ID <strong style="color: #E74C3C; background-color: #fde9e8; padding: 2px 5px; border-radius: 3px;">${
      order._id
    }</strong> has been successfully cancelled.</p>

    <div style="background-color: #fde9e8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h3 style="color: #E74C3C; margin-top: 0;">Cancellation Details:</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Order Status:</td>
          <td style="padding: 5px 10px;">Cancelled</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: bold;">Cancellation Date:</td>
          <td style="padding: 5px 10px;">${new Date().toLocaleString()}</td>
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
      <h3 style="color: #E74C3C;">Cancelled Order Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #fde9e8;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E74C3C;">Item</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #E74C3C;">Quantity</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #E74C3C;">Price</th>
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
      <h3 style="color: #E74C3C;">Financial Summary:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #fde9e8;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E74C3C;">Description</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #E74C3C;">Amount</th>
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
        <tr style="background-color: #fde9e8; font-weight: bold;">
          <td style="padding: 10px; color: #E74C3C;">Total Cancelled</td>
          <td style="padding: 10px; text-align: right; color: #E74C3C;">$${(
            order.totalPrice +
            order.shippingCost +
            order.taxAmount -
            order.totalDiscount
          ).toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <p>If you have any questions about this cancellation or need further assistance, please do not hesitate to contact our customer support team.</p>

    <div style="background-color: #f5f5f5; border-radius: 4px; padding: 15px; margin-top: 30px;">
      <p style="margin: 0; font-weight: bold;">Need help?</p>
      <p style="margin: 10px 0 0;">Email us at <a href="mailto:support@ecommerceapp.com" style="color: #E74C3C; text-decoration: none; border-bottom: 1px solid #E74C3C;">support@ecommerceapp.com</a></p>
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

export default confirmOrderCancelled;
