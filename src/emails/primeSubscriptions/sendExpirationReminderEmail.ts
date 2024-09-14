import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { IPrimeSubScription } from "../../models/primeMemberShip/primeSubscription.interface";

const sendExpirationReminderEmail = (
  user: IUser,
  primeSubscription: IPrimeSubScription
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Prime Membership is Expiring Soon - Renew Now!",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Prime Membership is Expiring Soon</title>
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
        <h1>Your Prime Membership is Expiring Soon</h1>
    </div>
    <div class="content">
        <p>Dear ${user.name},</p>
        <p>We hope you've been enjoying your Prime Membership! This is a friendly reminder that your membership is set to expire soon.</p>
        <h2>Membership Details:</h2>
        <ul>
            <li>Current Plan: ${primeSubscription.plan}</li>
            <li>Expiration Date: ${new Date(
              primeSubscription.endDate
            ).toLocaleDateString()}</li>
        </ul>
        <p>Don't miss out on these exclusive benefits:</p>
        <ul>
            <li>Free and fast shipping on eligible items</li>
            <li>Exclusive deals and discounts</li>
            <li>Early access to new products</li>
            <li>Premium customer support</li>
        </ul>
        <p>To ensure uninterrupted access to these amazing perks, renew your membership now:</p>
        <a href="${
          process.env.FRONTEND_URL
        }/renew-membership" class="button">Renew Now</a>
        <p>By renewing, you'll continue to enjoy all the benefits of Prime Membership without any interruption.</p>
    </div>
    <div class="footer">
        <p>If you have any questions about your membership or need assistance with renewal, our customer support team is always here to help.</p>
        <p>Thank you for being a valued Prime Member!</p>
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
      console.log("Expiration reminder email sent successfully.");
    }
  });
};

export default sendExpirationReminderEmail;
