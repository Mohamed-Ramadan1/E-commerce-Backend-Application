import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { ISupportTicket } from "../../models/userSupportTicket/supportTickets.interface";
const supportTicketReceivedConfirmationEmail = (
  user: IUser,
  supportTicket: ISupportTicket
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Support Ticket Received",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  <!-- Header -->
  <h1 style="color: #2C3E50; text-align: center; font-size: 24px; margin-bottom: 20px;">Support Ticket Confirmation</h1>

  <!-- Greeting -->
  <p style="font-size: 18px; margin-bottom: 20px;">Hello ${user.name},</p>

  <!-- Main Content -->
  <p style="margin-bottom: 20px;">Thank you for reaching out to our support team. We’ve received your support ticket and are here to assist you. Below are the details of your request:</p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr style="background-color: #f8f8f8;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Ticket ID:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${supportTicket._id}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Subject:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${supportTicket.subject}</td>
    </tr>
    <tr style="background-color: #f8f8f8;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Description:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${supportTicket.description}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Status:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${supportTicket.status}</td>
    </tr>
    <tr style="background-color: #f8f8f8;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Category:</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">${supportTicket.category}</td>
    </tr>
  </table>

  <p style="margin-bottom: 20px;">Our support team is currently reviewing your ticket and will get back to you as soon as possible. We appreciate your patience and will work to resolve your issue promptly.</p>

  <p style="margin-bottom: 20px;">In the meantime, if you need to provide additional information or have further questions, you can reply directly to this email, and we’ll update your ticket accordingly.</p>

  <!-- Button -->
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://your-website.com/tickets/${supportTicket._id}" style="background-color: #3498DB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">View Your Ticket</a>
  </div>

  <!-- Closing -->
  <p style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; margin-top: 30px; font-size: 14px;">
    Best regards,<br><strong>The E-commerce Application Team</strong>
  </p>

  <p style="text-align: center; font-size: 12px; color: #777;">© 2024 E-commerce Application. All rights reserved.</p>
</div>

    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Support ticket confirmation email sent");
    }
  });
};

export default supportTicketReceivedConfirmationEmail;
