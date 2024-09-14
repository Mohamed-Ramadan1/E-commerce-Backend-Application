import createMailTransporter from "../mailTransporter";
import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";

const confirmOrderCancellation = (user: IUser, order: IOrder) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Order has been Cancelled",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancellation</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            color: #E74C3C;
            font-size: 28px;
            margin-bottom: 20px;
        }
        .alert {
            background-color: #fff5f5;
            border-left: 4px solid #E74C3C;
            padding: 15px;
            margin-bottom: 20px;
        }
        .alert p {
            margin: 0;
            color: #E74C3C;
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
        <p>We are writing to confirm that your order has been cancelled.</p>
        
        <div class="alert">
            <p>Please note: There was an issue with the order.</p>
        </div>

        <table>
            <tr>
                <th>Order ID</th>
                <td data-label="Order ID">${order._id}</td>
            </tr>
            <tr>
                <th>Cancellation Date</th>
                <td data-label="Cancellation Date">${new Date().toLocaleDateString()}</td>
            </tr>
        </table>

        <p>If you have already paid for the order, the amount will be refunded to your account as soon as possible.</p>
        
        <h3>Need help?</h3>
        <p>If you have any questions or need further assistance, please contact our customer support team at <a href="mailto:support@ecommerceapp.com" style="color: #E74C3C; text-decoration: none; border-bottom: 1px solid #E74C3C;">support@ecommerceapp.com</a></p>

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
      console.log("Cancellation confirmation email sent");
    }
  });
};

export default confirmOrderCancellation;
