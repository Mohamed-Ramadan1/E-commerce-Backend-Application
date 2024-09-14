import createMailTransporter from "../mailTransporter";
import { ISubOrder } from "../../models/subOrders/subOrder.interface";
const sendWebsiteAdminOrderEmail = async (subOrder: ISubOrder) => {
  const transport = createMailTransporter();

  const orderItemsHTML = subOrder.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
        item.product.name
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center; font-size: 16px;">${
        item.quantity
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px;">$${item.discount.toFixed(
        2
      )}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px;">$${item.priceAfterDiscount.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: "mohamedramadan11b@gmail.com",
    subject: "New Website Order Received",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Website Order Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f7f7f7; margin: 0; padding: 20px; font-size: 16px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px; font-size: 24px;">New Website Order Received</h2>
          <p>Hello Website Admin,</p>
          <p>A new order has been placed on the website. Here are the details:</p>
          
          <!-- Order Summary -->
          <h3 style="color: #333; margin-top: 30px; font-size: 20px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Order ID:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
                  subOrder._id
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Order Date:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${subOrder.createdAt.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Total Items:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
                  subOrder.itemsQuantity
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Subtotal Price:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">$${subOrder.subtotalPrice.toFixed(
                  2
                )}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Total Discount:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">$${subOrder.totalDiscount.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Net Price:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">$${subOrder.netPrice.toFixed(
                  2
                )}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Shipping Address:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
                  subOrder.shippingAddress
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Payment Status:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
                  subOrder.paymentStatus
                }</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Payment Method:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
                  subOrder.paymentMethod
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; font-size: 16px;">Shipping Status:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 16px;">${
                  subOrder.shippingStatus
                }</td>
              </tr>
            </tbody>
          </table>

          <!-- Order Items -->
          <h3 style="color: #333; margin-top: 30px; font-size: 20px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-size: 16px;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; font-size: 16px;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; font-size: 16px;">Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; font-size: 16px;">Discount</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; font-size: 16px;">Price After Discount</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
            </tbody>
          </table>

          <p style="margin-top: 20px;">Thank you for your attention.</p>
          <p>Best regards,</p>
          <p>E-commerce Application Team</p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendWebsiteAdminOrderEmail;
