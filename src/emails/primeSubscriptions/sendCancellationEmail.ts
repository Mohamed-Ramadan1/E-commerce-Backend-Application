import { IUser } from "../../models/user/user.interface";
import { IPrimeSubScription } from "../../models/primeMemberShip/primeSubscription.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const sendCancellationEmail = (
  user: IUser,
  primeSubscription: IPrimeSubScription
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Your Prime Membership Cancellation Confirmation",
    html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prime Membership Cancellation Confirmation</title>
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
        <h1>Prime Membership Cancellation Confirmation</h1>
    </div>
    <div class="content">
        <p>Dear ${user.name},</p>
        <p>We're sorry to see you go. This email confirms that your Prime Membership has been cancelled as requested.</p>
        <h2>Important Information:</h2>
        <ul>
            <li>Your membership benefits will remain active until: ${new Date(
              primeSubscription.endDate
            ).toLocaleDateString()}</li>
            <li>No further payments will be taken from your account for this subscription.</li>
            <li>You'll continue to have access to Prime benefits until the end date mentioned above.</li>
        </ul>
        <p>We hope you've enjoyed your time as a Prime Member. Remember, you're welcome to reactivate your membership at any time to enjoy these benefits again:</p>
        <ul>
            <li>Free and fast shipping on eligible items</li>
            <li>Exclusive deals and discounts</li>
            <li>Early access to new products</li>
            <li>Premium customer support</li>
        </ul>
        <p>If you've changed your mind or cancelled by mistake, you can easily reactivate your membership:</p>
        <a href="${
          process.env.FRONTEND_URL
        }/reactivate-membership" class="button">Reactivate Membership</a>
    </div>
    <div class="footer">
        <p>If you have any questions about your cancellation or need assistance, our customer support team is always here to help.</p>
        <p>We hope to see you again soon!</p>
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
      console.log("Cancellation confirmation email sent successfully.");
    }
  });
};

export default sendCancellationEmail;
