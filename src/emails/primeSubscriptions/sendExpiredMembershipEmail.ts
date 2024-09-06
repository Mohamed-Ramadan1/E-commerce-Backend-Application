import { IPrimeSubScription } from "../../models/primeSubscription.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

const sendExpiredMembershipEmail = (
  user: IUser,
  primeSubscription: IPrimeSubScription
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Prime Membership Has Expired - Reactivate Now",
    html: `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Prime Membership Has Expired</title>
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
        <h1>Your Prime Membership Has Expired</h1>
    </div>
    <div class="content">
        <p>Dear ${user.name},</p>
        <p>We hope this email finds you well. We wanted to inform you that your Prime Membership has expired, and we were unable to process the automatic renewal.</p>
        <h2>Membership Details:</h2>
        <ul>
            <li>Previous Plan: ${primeSubscription.plan}</li>
            <li>Expiration Date: ${new Date(
              primeSubscription.endDate
            ).toLocaleDateString()}</li>
        </ul>
        <p>The automatic renewal may have failed due to one of the following reasons:</p>
        <ul>
            <li>Outdated payment information</li>
            <li>Insufficient funds in the associated account</li>
            <li>Technical issues during the payment process</li>
        </ul>
        <p>As a result, your Prime Membership benefits are no longer active. These include:</p>
        <ul>
            <li>Free and fast shipping on eligible items</li>
            <li>Exclusive deals and discounts</li>
            <li>Early access to new products</li>
            <li>Premium customer support</li>
        </ul>
        <p>We'd love to have you back as a Prime Member. To reactivate your membership and continue enjoying these benefits, please click the button below:</p>
        <a href="${
          process.env.FRONTEND_URL
        }/reactivate-membership" class="button">Reactivate Membership</a>
        <p>If you encounter any issues or need assistance with reactivation, our customer support team is ready to help.</p>
    </div>
    <div class="footer">
        <p>Thank you for being a part of our community. We hope to welcome you back to Prime Membership soon!</p>
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
      console.log("Expired membership email sent successfully.");
    }
  });
};

export default sendExpiredMembershipEmail;
