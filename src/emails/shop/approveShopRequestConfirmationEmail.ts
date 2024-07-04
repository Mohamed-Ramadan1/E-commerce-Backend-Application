import { IShop } from "../../models/shop.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size:1rem;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="text-align: center; color: #28a745;">Shop Request Accepted</h2>
          <p>Dear ${user.name},</p>
          <p>We are pleased to inform you that your request to open a shop named "<strong>${
            shop.shopName
          }</strong>" with shop ID <strong>${
      shop._id
    }</strong> has been accepted. You can now start adding products and managing your shop.</p>
          <h3>Shop Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${shop.shopName}</li>
            <li><strong>Description:</strong> ${shop.shopDescription}</li>
            <li><strong>Email:</strong> ${shop.email}</li>
            <li><strong>Phone:</strong> ${shop.phone}</li>
            <li><strong>Categories:</strong> ${
              shop.categories?.join(", ") || "N/A"
            }</li>
          </ul>
          <p>If you have any further questions, please do not hesitate to <a href="mailto:azaz123456az4@gmail.com" style="color: #007BFF;">contact us</a>.</p>
          <p>Best regards,</p>
          <p><strong>Your E-commerce Application Team</strong></p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${
            user.email
          } because you requested to open a shop on our platform and your request has been accepted.</p>
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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
