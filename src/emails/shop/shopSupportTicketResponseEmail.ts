import { IShopSupportTicket } from "../../models/shopSupportTicket/shopSupportTicket.interface";
import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import createMailTransporter from "../../config/mailTransporter.config";

const sendShopSupportTicketProcessedEmail = (
  shop: IShop,
  user: IUser,
  supportTicket: IShopSupportTicket
) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "E-commerce Application <support@ecommerceapp.com>",
    to: shop.email,
    subject: "Support Ticket Processed",
    text: `Dear ${shop.shopName},\n\nYour support ticket with ID ${supportTicket._id} has been processed. Here are the details of your ticket:\n\nSubject: ${supportTicket.subject}\nCategory: ${supportTicket.category}\nDescription: ${supportTicket.description}\n\nResponse from our team:\n\n${supportTicket.ticketResponse}\n\nIf you have any further questions, please do not hesitate to contact us.\n\nBest regards,\nYour E-commerce Application Team`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 1rem;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #007BFF;">Support Ticket Processed</h2>
        <p>Dear ${shop.shopName},</p>
        <p>Your support ticket has been processed. Here are the details of your ticket:</p>
        
        <div style="border-top: 2px solid #007BFF; margin: 20px 0; padding-top: 10px;">
          <h3 style="color: #333;">Ticket Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; font-weight: bold; color: #007BFF;">Ticket ID:</td>
              <td style="padding: 10px; word-wrap: break-word;">${
                supportTicket._id
              }</td>
            </tr>
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
        
        <div style="border-top: 2px solid #007BFF; margin: 20px 0; padding-top: 10px;">
          <h3 style="color: #333;">Ticket Response</h3>
          <div style="padding: 10px; background-color: #f9f9f9; border-radius: 5px; word-wrap: break-word; max-height: 200px; overflow-y: auto;">
            ${supportTicket.ticketResponse}
          </div>
        </div>
        
        <p>If you have any further questions, please do not hesitate to <a href="mailto:support@ecommerceapp.com" style="color: #007BFF;">contact us</a>.</p>
        <p>Best regards,</p>
        <p><strong>Your E-commerce Application Team</strong></p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #888;">This email was sent to ${
          shop.email
        } because a support ticket was processed on your shop's behalf.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your E-commerce Application. All rights reserved.</p>
      </div>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log("Error sending support ticket processed email:", err.message);
    } else {
      console.log("Support ticket processed email sent successfully.");
    }
  });
};

export default sendShopSupportTicketProcessedEmail;
