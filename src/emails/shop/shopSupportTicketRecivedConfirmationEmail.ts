import { IShopSupportTicket } from "../../models/shopSupportTicket.interface";
import { IShop } from "../../models/shop.interface";
import { IUser } from "../../models/user.interface";
import createMailTransporter from "../mailTransporter";

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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 1rem;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #007BFF;">Support Ticket Received</h2>
        <p>Dear ${shop.shopName},</p>
        <p>We have received a support ticket from <strong>${
          user.name
        }</strong>. Your ticket ID is <strong>${
      supportTicket._id
    }</strong>. Our team will review your request and respond to you shortly.</p>
        
        <div style="border-top: 2px solid #007BFF; margin: 20px 0; padding-top: 10px;">
          <h3 style="color: #333;">Ticket Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #007BFF;">Subject:</td>
              <td style="padding: 10px; word-wrap: break-word;">${
                supportTicket.subject
              }</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #007BFF;">Description:</td>
              <td style="padding: 10px; word-wrap: break-word;">${
                supportTicket.description
              }</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #007BFF;">Category:</td>
              <td style="padding: 10px; word-wrap: break-word;">${
                supportTicket.category
              }</td>
            </tr>
          </table>
        </div>
        
        <p>If you have any questions in the meantime, please do not hesitate to <a href="mailto:support@ecommerceapp.com" style="color: #007BFF;">contact us</a>.</p>
        <p>Best regards,</p>
        <p><strong>Your E-commerce Application Team</strong></p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #888;">This email was sent to ${
          shop.email
        } because a support ticket was submitted on your shop's behalf.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
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
