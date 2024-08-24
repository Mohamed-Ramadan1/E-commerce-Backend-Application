import createMailTransporter from "../mailTransporter";
import { IProduct } from "../../models/product.interface";

const sendAdminProductOutOfStockNotification = async (product: IProduct) => {
  const transport = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <noreply@your-ecommerce-platform.com>",
    to: "mohamedramadan11b@gmail.com",
    subject: `Admin Alert: Product Out of Stock - ${product.name}`,
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Notification: Product Out of Stock</title>
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
      border-bottom: 2px solid #e74c3c;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      color: #e74c3c;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    h2 {
      color: #e74c3c;
      margin-bottom: 20px;
      font-size: 22px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }
    .product-info {
      margin-bottom: 20px;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
    }
    .product-info th {
      text-align: left;
      padding: 12px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #e0e0e0;
      color: #e74c3c;
    }
    .product-info td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .product-info tr:last-child td {
      border-bottom: none;
    }
    a {
      color: #e74c3c;
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
      background-color: #e74c3c;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #c0392b;
      text-decoration: none;
    }
    .footer {
      background-color: #f8f8f8;
      border-top: 2px solid #e74c3c;
      color: #666666;
      text-align: center;
      padding: 20px;
      font-size: 14px;
    }
    .footer a {
      color: #e74c3c;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>E-commerce Platform Admin Alert</h1>
    </div>
    <div class="content">
      <h2>Product Out of Stock Notification</h2>
      <p>Dear Admin,</p>
      <p>This is an automated notification to inform you that a product in our inventory is now out of stock. Please find the details below:</p>

      <!-- Product Information -->
      <table class="product-info">
        <tr>
          <th>Product Name:</th>
          <td><a href="" target="_blank">${product.name}</a></td>
        </tr>
        <tr>
          <th>Product ID:</th>
          <td>${product._id}</td>
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
        <tr>
          <th>Source Type:</th>
          <td>${product.sourceType}</td>
        </tr>
        <tr>
          <th>Last Known Stock:</th>
          <td>${product.stock_quantity}</td>
        </tr>
      </table>

      <p>Please take the necessary actions to restock this item or update its availability status in our system. If this product is no longer available or needs to be removed from the platform, please update the product listing accordingly.</p>

      <div class="cta">
        <a href="" target="_blank" class="cta-button">Manage Product</a>
      </div>

      <p>If you need any additional information or assistance, please don't hesitate to contact the IT department.</p>

      <p>Best regards,</p>
      <p>E-commerce Platform System</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 <a href="https://www.your-ecommerce-platform.com" target="_blank">E-commerce Platform</a>. All rights reserved.</p>
      <p>Admin Portal: <a href="" target="_blank">Access Admin Dashboard</a></p>
    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(
      "Admin notification for out of stock product sent successfully"
    );
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
};

export default sendAdminProductOutOfStockNotification;
