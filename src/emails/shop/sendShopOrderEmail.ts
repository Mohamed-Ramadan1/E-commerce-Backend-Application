import createMailTransporter from "../mailTransporter";
import { IShopOrder } from "../../models/shopOrder.interface";
import { IShop } from "../../models/shop.interface";

const sendShopOrderEmail = async (shop: IShop, subOrder: IShopOrder) => {
  const transport = createMailTransporter();

  const orderItemsHTML = subOrder.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${
        item.product.name
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.discount.toFixed(
        2
      )}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.priceAfterDiscount.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email,
    subject: "New Order Received",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">New Order Received</h2>
          <p>Hello ${shop.shopName},</p>
          <p>You have received a new order. Here are the details:</p>
          
          <h3 style="color: #333; margin-top: 30px;">Order Details</h3>
          <p><strong>Order ID:</strong> ${subOrder._id}</p>
          <p><strong>Order Date:</strong> ${subOrder.createdAt.toLocaleString()}</p>
          <p><strong>Total Items:</strong> ${subOrder.itemsQuantity}</p>
          <p><strong>Total Price:</strong> $${subOrder.totalPrice.toFixed(
            2
          )}</p>
          <p><strong>Shipping Address:</strong> ${subOrder.shippingAddress}</p>
          
          <h3 style="color: #333; margin-top: 30px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Discount</th>
                <th style="padding: 10px; text-align: right;">Price After Discount</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
            </tbody>
          </table>
          
          <p style="margin-top: 30px;">Please process this order as soon as possible. If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>E-commerce Application Team</p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Order email sent to shop: ${shop.shopName}`);
  } catch (err) {
    console.error(`Error sending order email to shop ${shop.shopName}:`, err);
  }
};

export default sendShopOrderEmail;
