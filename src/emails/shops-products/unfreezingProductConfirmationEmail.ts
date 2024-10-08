import { IProduct } from "../../models/product/product.interface";
import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const productUnfreezeConfirmationEmail = (
  user: IUser,
  shop: IShop,
  product: IProduct
) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>", // sender address
    to: shop.email, // list of receivers
    subject: "Product Unfreeze Confirmation", // Subject line
    text: `Dear ${user.name},\n\nWe are writing to confirm that your product "${product.name}" has been successfully unfrozen. It is now visible to customers and available for purchase.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size:1rem;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="text-align: center; color: #28a745;">Product Unfreeze Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>We are writing to confirm that your product "<strong>${
            product.name
          }</strong>" has been successfully unfrozen. It is now visible to customers and available for purchase.</p>
          <p>If you have any questions or need further assistance, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${
            shop.email
          } because you unfroze a product in your shop on our platform.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Product unfreeze confirmation email sent successfully.");
    }
  });
};

export default productUnfreezeConfirmationEmail;
