import createMailTransporter from "../../config/mailTransporter.config";

import { IUser } from "../../models/user/user.interface";
import { IMessage } from "../../models/messages/message.interface";

const sendShopMessage = (user: IUser, message: IMessage) => {
  const transport = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: message.subject,
    html: `<!DOCTYPE html>
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
        .user-info {
            background-color: #e8eef3;
            border: 1px solid #c0d0e0;
            border-radius: 6px;
            padding: 15px;
            margin-top: 25px;
            font-size: 0.9em;
        }
        .user-info h3 {
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
        .prime-badge {
            display: inline-block;
            background-color: #ffd700;
            color: #333;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
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
            <div class="greeting">
                Hello, ${user.name}!
                ${
                  user.isPrimeUser
                    ? '<span class="prime-badge">Prime Member</span>'
                    : ""
                }
            </div>
            
            <div class="message-content">
                <p>${message.content}</p>
            </div>

            <a href="#" class="btn">View Account Details</a>

            <div class="user-info">
                <h3>Your Account Information</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phoneNumber}</p>
                <p><strong>Loyalty Points:</strong> ${user.loyaltyPoints}</p>
                <p><strong>Gift Card Balance:</strong> $${user.giftCard}</p>
                ${
                  user.isPrimeUser
                    ? `<p><strong>Prime Status:</strong> ${user.primeSubscriptionStatus}</p>`
                    : ""
                }
                <p><strong>Shipping Address:</strong> ${
                  user.shippingAddress || user.address || "N / A"
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
</html>`,
  };

  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Message send to user email successfully!");
    }
  });
};

export default sendShopMessage;
