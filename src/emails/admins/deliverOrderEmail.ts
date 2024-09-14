import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";

const confirmOrderDelivered = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Delivered",
    html: `
      <!DOCTYPE html>
      <html lang="en">
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f8f0;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            color: #4CAF50;
            font-size: 28px;
            margin-bottom: 20px;
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
            background-color: #e8f5e9;
            color: #4CAF50;
        }
        .footer {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #777;
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
    <div class="container">
        <h2 class="header">Hello ${user.name},</h2>
        <p>We are pleased to inform you that your order has been successfully delivered.</p>
        
        <h3>Order Details</h3>
        <table>
            <tr>
                <th>Order ID</th>
                <td data-label="Order ID">${order._id}</td>
            </tr>
            <tr>
                <th>Order Status</th>
                <td data-label="Order Status">${order.orderStatus}</td>
            </tr>
            <tr>
                <th>Payment Method</th>
                <td data-label="Payment Method">${order.paymentMethod}</td>
            </tr>
            <tr>
                <th>Payment Status</th>
                <td data-label="Payment Status">${order.paymentStatus}</td>
            </tr>
            <tr>
                <th>Shipping Address</th>
                <td data-label="Shipping Address">${order.shippingAddress}</td>
            </tr>
            <tr>
                <th>Phone Number</th>
                <td data-label="Phone Number">${order.phoneNumber}</td>
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

        <h3>Financial Summary</h3>
        <table>
            <tr>
                <th>Description</th>
                <th>Amount</th>
            </tr>
            <tr>
                <td data-label="Description">Subtotal</td>
                <td data-label="Amount">$${order.totalPrice.toFixed(2)}</td>
            </tr>
            <tr>
                <td data-label="Description">Shipping Cost</td>
                <td data-label="Amount">$${order.shippingCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td data-label="Description">Tax Amount</td>
                <td data-label="Amount">$${order.taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
                <td data-label="Description">Total Discount</td>
                <td data-label="Amount">-$${order.totalDiscount.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Total</th>
                <td data-label="Total">$${(
                  order.totalPrice - order.taxAmount
                ).toFixed(2)}</td>
            </tr>
        </table>

        <p>We hope you enjoy your purchase! If you have any questions or need further assistance, please contact our customer support team at <a href="mailto:support@ecommerceapp.com" style="color: #4CAF50; text-decoration: none; border-bottom: 1px solid #4CAF50;">support@ecommerceapp.com</a></p>

        <p>Best regards,<br><strong>E-commerce Application Team</strong></p>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      </html>
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
