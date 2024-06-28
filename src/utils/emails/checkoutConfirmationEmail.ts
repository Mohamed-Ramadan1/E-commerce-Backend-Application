import createMailTransporter from "./email";
import { IUser } from "../../models/user.interface";
import { IOrder } from "../../models/order.interface";

const checkoutConfirmationEmail = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();

  // Create the order items HTML
  const orderItemsHTML = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${
        item.product.name
      }</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$${item.discount}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">$${item.priceAfterDiscount.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Order Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Hello ${user.name},</h2>
        <p>Thank you for your order with our E-commerce application. Here are the details of your order:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Discount</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Price After Discount</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHTML}
          </tbody>
        </table>
        <p>Total Items: ${order.itemsQuantity}</p>
        <p>Total Discount: $${order.totalDiscount.toFixed(2)}</p>
        <p>Shipping Cost: $${order.shippingCost.toFixed(2)}</p>
        <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
       
        <p>Shipping Address: ${order.shippingAddress}</p>
        <p>Estimated Delivery Date: ${
          order.estimatedDeliveryDate
            ? order.estimatedDeliveryDate.toDateString()
            : "N/A"
        }</p>
        <p>If you have any questions about your order, please contact our support team.</p>
        <p style="margin-top: 20px;">Best regards,<br>E-commerce Application Team</p>
      </div>
    `,
  };

  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Order confirmation email sent");
    }
  });
};

export default checkoutConfirmationEmail;
