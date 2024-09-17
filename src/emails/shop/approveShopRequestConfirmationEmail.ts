import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";

const approveShopRequestConfirmationEmail = (user: IUser, shop: IShop) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>", // sender address
    to: user.email, // list of receivers
    subject: "Shop Request Accepted", // Subject line
    text: `Dear ${
      user.name
    },\n\nWe are pleased to inform you that your request to open a shop named "${
      shop.shopName
    }" with shop ID ${
      shop._id
    } has been accepted. You can now start adding products and managing your shop.\n\nShop Details:\nName: ${
      shop.shopName
    }\nDescription: ${shop.shopDescription}\nEmail: ${shop.email}\nPhone: ${
      shop.phone
    }\nCategories: ${
      shop.categories?.join(", ") || "N/A"
    }\n\nIf you have any further questions, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`, // plain text body
    html: `
   <div style="font-family: 'Roboto', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f0fff0; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #28a745; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Shop Request Accepted</h2>
    <p style="margin-bottom: 20px;">Dear ${user.name},</p>
    <p style="margin-bottom: 20px;">We are pleased to inform you that your request to open a shop named "<strong style="color: #28a745;">${
      shop.shopName
    }</strong>" with shop ID <strong style="color: #28a745; background-color: #e8f5e9; padding: 2px 5px; border-radius: 3px;">${
      shop._id
    }</strong> has been accepted. You can now start adding products and managing your shop.</p>
    <div style="background-color: #e8f5e9; border: 1px solid #c3e6cb; border-radius: 4px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #28a745; margin-top: 0;">Shop Details:</h3>
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 10px;"><strong>Name:</strong> ${
          shop.shopName
        }</li>
        <li style="margin-bottom: 10px;"><strong>Description:</strong> ${
          shop.shopDescription
        }</li>
        <li style="margin-bottom: 10px;"><strong>Email:</strong> ${
          shop.email
        }</li>
        <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${
          shop.phone
        }</li>
        <li><strong>Categories:</strong> ${
          shop.categories?.join(", ") || "N/A"
        }</li>
      </ul>
    </div>
    <p style="margin-bottom: 20px;">If you have any further questions, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #28a745; text-decoration: none; border-bottom: 1px solid #28a745;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        user.email
      } because you requested to open a shop on our platform and your request has been accepted.</p>
      <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</div>
    `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Shop request acceptance email sent successfully.");
    }
  });
};

export default approveShopRequestConfirmationEmail;
