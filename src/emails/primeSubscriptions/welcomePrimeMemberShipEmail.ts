import { IPrimeSubScription } from "../../models/primeSubscription.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

const welcomePrimeMemberShipEmail = (
  user: IUser,
  primeSubscription: IPrimeSubScription
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Welcome to prime memberShip. ",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Prime Membership!</title>
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
            background-color: #232f3e;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #f6f6f6;
            padding: 20px;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            background-color: #ff9900;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Prime Membership!</h1>
    </div>
    <div class="content">
        <p>Dear ${user.name},</p>
        <p>Welcome to our exclusive Prime Membership program! We're thrilled to have you on board and can't wait for you to experience all the amazing benefits we have in store for you.</p>
        <h2>Your Membership Details:</h2>
        <ul>
            <li>Membership Status: ${primeSubscription.status}</li>
            <li>Plan: ${primeSubscription.plan}</li>
            <li>Start Date: ${new Date(
              primeSubscription.startDate
            ).toLocaleDateString()}</li>
            <li>Next Billing Date: ${new Date(
              primeSubscription.nextBillingDate
            ).toLocaleDateString()}</li>
        </ul>
        <p>As a Prime Member, you'll enjoy:</p>
        <ul>
            <li>Free and fast shipping on eligible items</li>
            <li>Exclusive deals and discounts</li>
            <li>Early access to new products</li>
            <li>Premium customer support</li>
        </ul>
        <p>Ready to start shopping? Click the button below to explore our latest offerings!</p>
        <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a>
    </div>
    <div class="footer">
        <p>If you have any questions about your membership, please don't hesitate to contact our customer support team.</p>
        <p>&copy; ${new Date().getFullYear()} Your E-commerce Platform. All rights reserved.</p>
    </div>
</body>
</html>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Welcome membership message send successfully.");
    }
  });
};

export default welcomePrimeMemberShipEmail;
