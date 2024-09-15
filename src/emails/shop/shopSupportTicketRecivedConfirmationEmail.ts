import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import { IShopSupportTicket } from "../../models/supportTickets/shopSupportTicket.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const sendShopSupportTicketReceivedEmail = (
  shop: IShop,
  user: IUser,
  supportTicket: IShopSupportTicket
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <support@ecommerceapp.com>",
    to: shop.email,
    subject: "Support Ticket Received",
    text: `Dear ${shop.shopName},\n\nWe have received a support ticket from ${user.name}. Your ticket ID is ${supportTicket._id}. Our team will review your request and respond to you shortly.\n\nTicket Details:\n\nSubject: ${supportTicket.subject}\nDescription: ${supportTicket.description}\nCategory: ${supportTicket.category}\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; font-size: 16px; background-color: #f0f7ff; padding: 20px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; color: #007BFF; margin-bottom: 30px; font-size: 28px; font-weight: bold;">Support Ticket Received</h2>
    <p style="margin-bottom: 20px;">Dear ${shop.shopName},</p>
    <p style="margin-bottom: 20px;">We have received a support ticket from <strong>${
      user.name
    }</strong>. Your ticket ID is <strong style="color: #007BFF; background-color: #e6f2ff; padding: 2px 5px; border-radius: 3px;">${
      supportTicket._id
    }</strong>. Our team will review your request and respond to you shortly.</p>
    
    <div style="border-top: 2px solid #007BFF; margin: 30px 0; padding-top: 20px;">
      <h3 style="color: #007BFF; margin-bottom: 20px;">Ticket Details</h3>
      <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #007BFF; width: 30%; vertical-align: top;">Subject:</td>
          <td style="padding: 10px; word-wrap: break-word; background-color: #f8f9fa; border-radius: 4px;">${
            supportTicket.subject
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #007BFF; width: 30%; vertical-align: top;">Description:</td>
          <td style="padding: 10px; word-wrap: break-word; background-color: #f8f9fa; border-radius: 4px;">${
            supportTicket.description
          }</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #007BFF; width: 30%; vertical-align: top;">Category:</td>
          <td style="padding: 10px; word-wrap: break-word; background-color: #f8f9fa; border-radius: 4px;">${
            supportTicket.category
          }</td>
        </tr>
      </table>
    </div>
    
    <p style="margin-bottom: 20px;">If you have any questions in the meantime, please do not hesitate to <a href="mailto:support@ecommerceapp.com" style="color: #007BFF; text-decoration: none; border-bottom: 1px solid #007BFF;">contact us</a>.</p>
    <p style="margin-bottom: 10px;">Best regards,</p>
    <p style="margin-bottom: 30px;"><strong>Your E-commerce Application Team</strong></p>
    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 14px; color: #777;">
      <p style="margin-bottom: 10px;">This email was sent to ${
        shop.email
      } because a support ticket was submitted on your shop's behalf.</p>
      <p>&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
    </div>
  </div>
</div>
  `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log("Error sending support ticket received email:", err.message);
    } else {
      console.log("Support ticket received email sent successfully.");
    }
  });
};

export default sendShopSupportTicketReceivedEmail;
