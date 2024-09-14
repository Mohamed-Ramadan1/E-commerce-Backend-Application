import { IProduct } from "../../models/product/product.interface";
import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const addProductConfirmationEmail = (
  user: IUser,
  shop: IShop,
  product: IProduct
) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email,
    subject: "New Product Added Successfully",
    html: `
      <!DOCTYPE html>
      <html lang="en">
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Added Successfully</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            color: #28a745;
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
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
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
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
        <h2 class="header">Product Added Successfully</h2>
        <p>Dear ${user.name},</p>
        <p>We are pleased to inform you that your new product has been successfully added to your shop. Your product is now visible to customers and available for purchase.</p>
        
        <h3>Product Details</h3>
        <table>
            <tr>
                <th>Product Name</th>
                <td data-label="Product Name">${product.name}</td>
            </tr>
            <tr>
                <th>Category</th>
                <td data-label="Category">${product.category}</td>
            </tr>
            <tr>
                <th>Price</th>
                <td data-label="Price">$${product.price.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Stock Quantity</th>
                <td data-label="Stock Quantity">${product.stock_quantity}</td>
            </tr>
        </table>

        <h3>Shop Information</h3>
        <table>
            <tr>
                <th>Shop Name</th>
                <td data-label="Shop Name">${shop.shopName}</td>
            </tr>
            <tr>
                <th>Shop Email</th>
                <td data-label="Shop Email">${shop.email}</td>
            </tr>
        </table>

        <p>If you have any questions or need to make changes to your product listing, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br><strong>Your E-commerce Application Team</strong></p>
    </div>
    <div class="footer">
        <p>This email was sent to ${
          shop.email
        } because you added a new product to your shop on our platform.</p>
        <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
    </div>
</body>
</html>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Product addition confirmation email sent successfully.");
    }
  });
};

export default addProductConfirmationEmail;
