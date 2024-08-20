import createMailTransporter from "../mailTransporter";
import { IShopOrder } from "../../models/shopOrder.interface";
import { IShop } from "../../models/shop.interface";

const sendShopOrderEmail = async (shop: IShop, subOrder: IShopOrder) => {
  const transport = createMailTransporter();

  const orderItemsHTML = subOrder.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 14px; border-bottom: 1px solid #eee; font-size: 16px;">${
        item.product.name
      }</td>
      <td style="padding: 14px; border-bottom: 1px solid #eee; text-align: center; font-size: 16px;">${
        item.quantity
      }</td>
      <td style="padding: 14px; border-bottom: 1px solid #eee; text-align: right; font-size: 16px;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 14px; border-bottom: 1px solid #eee; text-align: right; font-size: 16px;">$${item.discount.toFixed(
        2
      )}</td>
      <td style="padding: 14px; border-bottom: 1px solid #eee; text-align: right; font-size: 16px;">$${item.priceAfterDiscount.toFixed(
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
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 25px; font-size: 24px;">New Order Received</h2>
          
          <p style="font-size: 18px; margin-bottom: 20px;">Hello <strong>${
            shop.shopName
          }</strong>,</p>
          <p style="font-size: 18px; margin-bottom: 20px;">You have received a new order. Please find the details below:</p>
          
          <!-- First Table: Order Summary -->
          <h3 style="color: #333; margin-top: 30px; font-size: 20px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 16px;">
            <tbody>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Order ID:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${
                  subOrder._id
                }</td>
              </tr>
              <tr>
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Order Date:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${subOrder.createdAt.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Total Items:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${
                  subOrder.itemsQuantity
                }</td>
              </tr>
              <tr>
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Subtotal Price:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">$${subOrder.subtotalPrice.toFixed(
                  2
                )}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Total Discount:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">$${subOrder.totalDiscount.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Platform Fee:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">$${
                  subOrder.platformFee ? subOrder.platformFee.toFixed(2) : "N/A"
                }</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Net Price:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">$${subOrder.netPrice.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Payment Status:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${
                  subOrder.paymentStatus
                }</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Shipping Status:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${
                  subOrder.shippingStatus
                }</td>
              </tr>
              <tr>
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Order Status:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${
                  subOrder.orderStatus
                }</td>
              </tr>
              ${
                subOrder.discountCodes!.length > 0
                  ? `<tr style="background-color: #f2f2f2;">
                <td style="padding: 14px; border-bottom: 1px solid #eee; font-weight: bold;">Discount Codes:</td>
                <td style="padding: 14px; border-bottom: 1px solid #eee;">${subOrder.discountCodes?.join(
                  ", "
                )}</td>
              </tr>`
                  : ""
              }
            </tbody>
          </table>

          <!-- Second Table: Order Items -->
          <h3 style="color: #333; margin-top: 30px; font-size: 20px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 16px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 14px; border-bottom: 1px solid #eee; text-align: left; font-weight: bold;">Product</th>
                <th style="padding: 14px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold;">Quantity</th>
                <th style="padding: 14px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">Price</th>
                <th style="padding: 14px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">Discount</th>
                <th style="padding: 14px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">Price After Discount</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
            </tbody>
          </table>

          <p style="font-size: 18px; margin-top: 30px;">The order will be processed soon as possible. </p>
          <p style="font-size: 18px; margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
          <p style="font-size: 18px; margin-top: 30px;">Best regards,<br><strong>E-commerce Application Team</strong></p>
          
          <footer style="margin-top: 40px; margin-bottom: 40px; text-align: center; color: #777;">
            <p style="font-size: 18px;">&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
             <p style="font-size: 16px;">
              <a href="https://www.yourwebsite.com" style="color: #4CAF50; text-decoration: none;">Visit our website</a>
            </p>
          </footer>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Order email sent to ${shop.email}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

export default sendShopOrderEmail;
