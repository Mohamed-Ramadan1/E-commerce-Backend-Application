import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";

const checkoutConfirmationEmail = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();

  const orderItemsHTML = order.items
    .map(
      (item: any) => `
      <tr>
        <td data-label="Item">${item.product.name}</td>
        <td data-label="Quantity">${item.quantity}</td>
        <td data-label="Price">$${item.priceAfterDiscount.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Order Confirmation",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background-color: #f2f2f2;
        }
        @media only screen and (max-width: 600px) {
            table, tr, td {
                display: block;
            }
            tr {
                margin-bottom: 10px;
            }
            td {
                border: none;
                position: relative;
                padding-left: 50%;
            }
            td:before {
                content: attr(data-label);
                position: absolute;
                left: 6px;
                width: 45%;
                padding-right: 10px;
                white-space: nowrap;
                font-weight: bold;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Order Confirmation</h1>
    </div>
    <div class="content">
        <h2>Hello ${user.name},</h2>
        <p>Thank you for your order. Here are the details:</p>
        
        <table>
            <tr>
                <th>Order ID</th>
                <td data-label="Order ID">${order._id}</td>
            </tr>
            <tr>
                <th>Order Date</th>
                <td data-label="Order Date">${new Date(
                  order.createdAt
                ).toLocaleDateString()}</td>
            </tr>
            <tr>
                <th>Order Status</th>
                <td data-label="Order Status">${order.orderStatus}</td>
            </tr>
        </table>

        <h3>Order Summary</h3>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
                  .map(
                    (item) => `
                <tr>
                    <td data-label="Item">${item.product.name}</td>
                    <td data-label="Quantity">${item.quantity}</td>
                    <td data-label="Price">$${item.priceAfterDiscount.toFixed(
                      2
                    )}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <h3>Order Totals</h3>
        <table>
            <tr>
                <th>Subtotal</th>
                <td data-label="Subtotal">$${(
                  order.totalPrice -
                  order.shippingCost -
                  order.taxAmount
                ).toFixed(2)}</td>
            </tr>
            <tr>
                <th>Shipping</th>
                <td data-label="Shipping">$${order.shippingCost.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Tax</th>
                <td data-label="Tax">$${order.taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Total</th>
                <td data-label="Total">$${order.totalPrice.toFixed(2)}</td>
            </tr>
        </table>

        <h3>Shipping Information</h3>
        <table>
            <tr>
                <th>Address</th>
                <td data-label="Address">${order.shippingAddress}</td>
            </tr>
            <tr>
                <th>Estimated Delivery</th>
                <td data-label="Estimated Delivery">${
                  order.estimatedDeliveryDate
                    ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
                    : "N/A"
                }</td>
            </tr>
        </table>

        ${user.isPrimeUser ? `<p>Thank you for being a Prime member!</p>` : ""}
        
        <p>If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
        <p>Best regards,<br>E-commerce Application Team</p>
    </div>
</body>
</html>
      </html>
    `.replace("${orderItemsHTML}", orderItemsHTML),
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
