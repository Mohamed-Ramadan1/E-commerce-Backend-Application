import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";

const confirmOrderShippedSuccessfully = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();

  // Generate the list of items in the order
  const itemsList = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${
        item.product.name
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">$${item.priceAfterDiscount.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Shipped",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50; text-align: center;">Hello ${user.name},</h2>
        <p style="font-size: 16px;">We are excited to inform you that your order with ID <strong>${
          order._id
        }</strong> has been successfully shipped.</p>

        <!-- Order Summary Table -->
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #2C3E50; margin-bottom: 10px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f0f0f0; border-bottom: 2px solid #ccc;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Quantity</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Total Items:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">${
                order.itemsQuantity
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Total Price:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">$${order.totalPrice.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Shipping Cost:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">$${order.shippingCost.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Discount Applied:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">-$${order.totalDiscount.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Estimated Delivery Date:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">${
                order.estimatedDeliveryDate?.toLocaleDateString() || "N/A"
              }</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Details Table -->
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="color: #2C3E50; margin-bottom: 10px;">Shipping Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Shipping Address:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">${
                order.shippingAddress
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Phone Number:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">${
                order.phoneNumber
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Payment Method:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">${
                order.paymentMethod
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0;"><strong>Payment Status:</strong></td>
              <td style="padding: 10px; border-top: 1px solid #e0e0e0; text-align: right;">${
                order.paymentStatus
              }</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 16px; margin-top: 20px;">If you have any questions or need further assistance, please do not hesitate to contact our customer support team.</p>
        <p style="font-size: 16px; margin-top: 20px;">Best regards,<br><span style="font-weight: bold;">E-commerce Application Team</span></p>
      </div>
    `,
  };

  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Shipping confirmation email sent");
    }
  });
};

export default confirmOrderShippedSuccessfully;
