import createMailTransporter from "../../config/mailTransporter.config";
import { IProduct } from "../../models/product/product.interface";
import { IShop } from "../../models/shop/shop.interface";
const sendProductUnavailableEmail = async (product: IProduct, shop: IShop) => {
  const transport = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: shop.email, // Replace with the user's email address
    subject: `Product Unavailable: ${product.name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Out of Stock Notification</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      color: #333333;
      line-height: 1.6;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #f8f8f8;
      border-bottom: 2px solid #3498db;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      color: #3498db;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    h2 {
      color: #3498db;
      margin-bottom: 20px;
      font-size: 22px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }
    h3 {
      color: #3498db;
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .product-info, .shop-info {
      margin-bottom: 20px;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
    }
    .product-info th, .shop-info th {
      text-align: left;
      padding: 12px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #e0e0e0;
      color: #3498db;
    }
    .product-info td, .shop-info td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .product-info tr:last-child td, .shop-info tr:last-child td {
      border-bottom: none;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .cta {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      color: #ffffff;
      background-color: #3498db;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #2980b9;
      text-decoration: none;
    }
    .footer {
      background-color: #f8f8f8;
      border-top: 2px solid #3498db;
      color: #666666;
      text-align: center;
      padding: 20px;
      font-size: 14px;
    }
    .footer a {
      color: #3498db;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>E-commerce Platform</h1>
    </div>
    <div class="content">
      <h2>Product Out of Stock Notification</h2>
      <p>Dear ${shop.shopName},</p>
      <p>We wanted to inform you that one of your products listed on our platform is now out of stock. Please find the details below:</p>

      <!-- Product Information -->
      <h3>Product Details</h3>
      <table class="product-info">
        <tr>
          <th>Product Name:</th>
          <td><a href="" target="_blank">${product.name}</a></td>
        </tr>
        <tr>
          <th>Category:</th>
          <td>${product.category}</td>
        </tr>
        <tr>
          <th>Brand:</th>
          <td>${product.brand}</td>
        </tr>
        <tr>
          <th>Price:</th>
          <td>$${product.price.toFixed(2)}</td>
        </tr>
        <tr>
          <th>Availability Status:</th>
          <td>Out of Stock</td>
        </tr>
      </table>

      <!-- Shop Information -->
      <h3>Shop Details</h3>
      <table class="shop-info">
        <tr>
          <th>Shop Name:</th>
          <td><a href="" target="_blank">${shop.shopName}</a></td>
        </tr>
        <tr>
          <th>Owner Name:</th>
          <td>${shop.shopName}</td>
        </tr>
        <tr>
          <th>Email:</th>
          <td><a href="mailto:${shop.email}">${shop.email}</a></td>
        </tr>
        <tr>
          <th>Phone:</th>
          <td>${shop.phone}</td>
        </tr>
      </table>

      <p>Please review your inventory and restock the item as soon as possible to ensure its availability to customers. If you need assistance with updating your inventory, feel free to reach out to our support team.</p>

      <div class="cta">
        <a href="" target="_blank" class="cta-button">Manage Your Shop</a>
      </div>

      <p>Thank you for your continued partnership with us.</p>
      <p>Best regards,</p>
      <p>E-commerce Platform Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 <a style="text-color:green;" href="https://www.your-ecommerce-platform.com" target="_blank">E-commerce Platform</a>. All rights reserved.</p>
      <p>123 Commerce Street, City, State, ZIP </p>
      <p> support@your-E-commerce-platform.com | (555) 123-4567</p>
    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Product Unavailability Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendProductUnavailableEmail;
