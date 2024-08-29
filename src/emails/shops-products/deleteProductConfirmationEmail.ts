import { IProduct } from "../../models/product.interface";
import { IShop } from "../../models/shop.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

const productDeletionConfirmationEmail = (
  user: IUser,
  shop: IShop,
  product: IProduct
) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>", // sender address
    to: shop.email, // list of receivers
    subject: "Product Deletion Confirmation", // Subject line
    text: `Dear ${user.name},\n\nWe are writing to confirm that your product "${product.name}" has been successfully deleted from your shop. If this was a mistake or if you have any further questions, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Deletion Confirmation</title>
    <style>
        /* Base styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #dc3545;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
        h1, h2 {
            margin: 0;
            line-height: 1.2;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 18px;
            font-weight: normal;
        }
        .product-details {
            background-color: #f8f9fa;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
        .product-details p {
            margin: 5px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
                margin: 0;
                border-radius: 0;
            }
            .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Product Deletion Confirmation</h1>
            <h2>Your E-commerce Application</h2>
        </div>
        <div class="content">
            <p>Dear ${user.name},</p>
            <p>We are writing to confirm that your product has been successfully deleted from your shop. Here are the details of the deleted product:</p>
            
            <div class="product-details">
                <p><strong>Product Name:</strong> ${product.name}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Stock Quantity:</strong> ${
                  product.stock_quantity
                }</p>
                <p><strong>Average Rating:</strong> ${product.averageRating.toFixed(
                  1
                )} (${product.totalReviews} reviews)</p>
            </div>

            <p>If this deletion was a mistake or if you have any further questions, please don't hesitate to contact our support team.</p>
            
            <a href="mailto:azaz123456az4@gmail.com" class="button">Contact Support</a>

            <p>Thank you for using our platform to manage your shop inventory.</p>
            
            <p>Best regards,<br><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div class="footer">
            <p>This email was sent to ${
              shop.email
            } because you deleted a product from your shop on our platform.</p>
            <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Product deletion confirmation email sent successfully.");
    }
  });
};

export default productDeletionConfirmationEmail;
