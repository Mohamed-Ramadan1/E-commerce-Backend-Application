import createMailTransporter from "../../config/mailTransporter.config";
import { IMessage } from "../../models/messages/message.interface";
import { IShop } from "../../models/shop/shop.interface";

const sendShopMessage = (shop: IShop, message: IMessage) => {
  const transport = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <your-email@example.com>",
    to: shop.email,
    subject: message.subject,
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${message.subject}</title>
    <style>
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            background-color: #f5f7fa;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #3c4e62;
            color: #ffffff;
            padding: 25px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 22px;
            font-weight: bold;
            color: #3c4e62;
            margin-bottom: 20px;
        }
        .message-content {
            background-color: #f0f4f8;
            color: #333;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #5b7a9d;
            margin-bottom: 25px;
        }
        .details-box {
            background-color: #e8eef3;
            border: 1px solid #c0d0e0;
            border-radius: 6px;
            padding: 15px;
            margin-top: 25px;
            font-size: 0.9em;
        }
        .details-box h3 {
            margin-top: 0;
            color: #3c4e62;
            font-size: 1.1em;
        }
        .footer {
            background-color: #3c4e62;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #ecf0f1;
        }
        a {
            color: #5b7a9d;
            text-decoration: none;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #5b7a9d;
            color: #ffffff;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 25px;
            transition: background-color 0.3s ease;
        }
        .btn:hover {
            background-color: #4c6987;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
                width: calc(100% - 20px);
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            E-commerce Application
        </div>
        <div class="content">
            <div class="greeting">Hello, ${shop.shopName}!</div>
            
            <div class="message-content">
                <p>${message.content}</p>
            </div>

            <a href="#" class="btn">View Details</a>

            <div class="details-box">
                <h3>Message Details</h3>
                <p><strong>Category:</strong> ${
                  message.metaData?.category || "N/A"
                }</p>
                <p><strong>Priority:</strong> ${
                  message.metaData?.priority || "N/A"
                }</p>
                <p><strong>Tags:</strong> ${
                  message.metaData?.tags?.join(", ") || "N/A"
                }</p>
                <p><strong>Action Required:</strong> ${
                  message.metaData?.actionRequired ? "Yes" : "No"
                }</p>
            </div>
        </div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} E-commerce Application. All rights reserved.</p>
            <p>
                <a href="#" style="color: #ecf0f1;">Unsubscribe</a> | 
                <a href="#" style="color: #ecf0f1;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
  `,
  };

  // Send the email and handle potential errors
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.error("Error sending email:", err.message);
    } else {
      console.log("Email successfully sent to:", shop.email);
    }
  });
};

export default sendShopMessage;
